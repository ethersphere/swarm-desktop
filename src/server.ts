import { Wallet } from '@ethereumjs/wallet'
import Router from '@koa/router'
import { parseUnits } from 'ethers'
import { readFile } from 'fs/promises'
import { Server } from 'http'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import mount from 'koa-mount'
import serve from 'koa-static'
import * as path from 'path'

import PACKAGE_JSON from '../package.json'

import { getApiKey } from './api-key'
import { sendBzzTransaction, sendNativeTransaction } from './blockchain'
import {
  BEE_NODE_URL,
  configFile,
  dataDirFilePath,
  GIFT_WALLET_BZZ_AMOUNT,
  GIFT_WALLET_DAI_AMOUNT,
  readConfigYaml,
  readWalletPasswordOrThrow,
  writeConfigYaml,
} from './config'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { logger, readBeeDesktopLogs, readBeeLogs, subscribeLogServerRequests } from './logger'
import { getPath } from './path'
import { port } from './port'
import { getStatus } from './status'
import { swap } from './swap'

const UI_DIST = path.join(__dirname, '..', '..', 'ui')
const AUTO_UPDATE_ENABLED_PLATFORMS = ['darwin', 'win32']
const TOKEN_SERVICE_URL = 'https://bff.cow.fi/1/tokens/0x19062190B1925b5b6689D7073fDfC8c2976EF8Cb/usdPrice'
const PEERS_ENDPOINT = '/peers'

let serverInstance: Server | null = null
let isRestarting = false
let walletTransactionQueue: Promise<unknown> = Promise.resolve()

function withWalletLock<T>(task: () => Promise<T>): Promise<T> {
  const result = walletTransactionQueue.then(task, task)
  walletTransactionQueue = result.then(
    (): void => undefined,
    (): void => undefined,
  )

  return result
}

export function isServerRunning(): boolean {
  return isRestarting || (serverInstance !== null && serverInstance.listening)
}

export async function restartServer(): Promise<void> {
  if (isRestarting) return
  isRestarting = true
  try {
    if (serverInstance) {
      const current = serverInstance
      await new Promise<void>(resolve => current.close(() => resolve()))
      serverInstance = null
    }
    runServer()
  } finally {
    isRestarting = false
  }
}

interface PeersResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  peers?: any[]
}

export function runServer() {
  const app = new Koa()
  logger.info(`Serving UI from path: ${UI_DIST}`)
  app.use(mount('/dashboard', serve(UI_DIST)))

  app.use(async (context, next) => {
    const corsOrigin = process.env.NODE_ENV === 'development' ? '*' : `http://localhost:${port.value}`
    context.set('Access-Control-Allow-Origin', corsOrigin)
    context.set('Access-Control-Allow-Credentials', 'true')
    context.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Referer, Baggage',
    )
    context.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    await next()
  })

  app.use(koaBodyparser({ onerror: logger.error }))
  const router = new Router()

  // Open endpoints without any authentication
  router.get('/info', context => {
    context.body = {
      name: 'bee-desktop',
      version: PACKAGE_JSON.version,
      autoUpdateEnabled: AUTO_UPDATE_ENABLED_PLATFORMS.includes(process.platform),
    }
  })
  router.get('/price', async context => {
    try {
      const response = await fetch(TOKEN_SERVICE_URL)
      const data = (await response.json()) as { price: number }
      context.body = JSON.stringify(String(data.price))
    } catch (error) {
      logger.error(error)
      context.status = 503
      context.body = { message: 'Failed to fetch price from token service', error }
    }
  })

  router.use(async (context, next) => {
    const { authorization } = context.headers

    if (authorization !== getApiKey()) {
      context.status = 401
      context.body = 'Unauthorized'

      return
    }
    await next()
  })

  // Authenticated endpoints
  router.get('/status', context => {
    context.body = getStatus()
  })
  router.get(PEERS_ENDPOINT, async context => {
    try {
      const response = await fetch(`${BEE_NODE_URL}${PEERS_ENDPOINT}`)
      const { peers } = (await response.json()) as PeersResponse

      context.body = { connections: peers ? peers.length || 0 : 0 }
    } catch (error) {
      logger.error(error)
      context.body = { connections: 0 }
    }
  })
  router.post('/config', context => {
    const { 'config-file-path': _, ...rest } = context.request.body as Record<string, unknown>
    writeConfigYaml(rest)
    context.body = readConfigYaml()
  })
  router.get('/config', context => {
    context.body = { ...readConfigYaml(), 'config-file-path': getPath(configFile) }
  })
  router.get('/logs/bee-desktop', async context => {
    context.body = await readBeeDesktopLogs()
  })
  router.get('/logs/bee', async context => {
    try {
      context.body = await readBeeLogs()
    } catch (e) {
      // Bee might not be started and hence the logs might not be available
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        context.status = 400

        return
      }

      throw e
    }
  })
  router.post('/restart', async context => {
    BeeManager.stop()
    await BeeManager.waitForSigtermToFinish()
    runLauncher()
    context.body = { success: true }
  })
  router.post('/gift-wallet/:address', async context => {
    const config = readConfigYaml()
    const blockchainRpcEndpoint = Reflect.get(config, 'blockchain-rpc-endpoint') as string
    const privateKeyString = await getPrivateKey()
    const { address } = context.params
    try {
      await withWalletLock(async () => {
        await sendBzzTransaction(
          privateKeyString,
          address,
          parseUnits(GIFT_WALLET_BZZ_AMOUNT, 16).toString(),
          blockchainRpcEndpoint,
        )
        await sendNativeTransaction(
          privateKeyString,
          address,
          parseUnits(GIFT_WALLET_DAI_AMOUNT, 18).toString(),
          blockchainRpcEndpoint,
        )
      })
      context.body = { success: true }
    } catch (error) {
      logger.error(error)
      context.status = 500
      context.body = { message: 'Failed to fund gift wallet', error }
    }
  })
  router.post('/swap', async context => {
    const config = readConfigYaml()
    const blockchainRpcEndpoint = Reflect.get(config, 'blockchain-rpc-endpoint') as string
    const privateKeyString = await getPrivateKey()
    try {
      await withWalletLock(() =>
        swap(privateKeyString, (context.request.body as Record<string, string>).dai, '10000', blockchainRpcEndpoint),
      )
      context.body = { success: true }
    } catch (error) {
      logger.error(error)
      context.status = 500
      context.body = { message: 'Failed to swap', error }
    }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  serverInstance = app.listen(port.value)
  subscribeLogServerRequests(serverInstance)
}

async function getPrivateKey(): Promise<string> {
  const v3 = await readFile(getPath(path.join(dataDirFilePath, 'keys', 'swarm.key')), 'utf-8')
  const wallet = await Wallet.fromV3(v3, readWalletPasswordOrThrow())
  const privateKeyString = wallet.getPrivateKeyString()

  return privateKeyString
}
