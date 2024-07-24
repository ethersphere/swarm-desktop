import Router from '@koa/router'
import Wallet from 'ethereumjs-wallet'
import { readFile } from 'fs/promises'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import mount from 'koa-mount'
import serve from 'koa-static'
import fetch from 'node-fetch'
import * as path from 'path'

import PACKAGE_JSON from '../package.json'
import { getApiKey } from './api-key'
import { sendBzzTransaction, sendNativeTransaction } from './blockchain'
import { readConfigYaml, readWalletPasswordOrThrow, writeConfigYaml } from './config'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { logger, readBeeDesktopLogs, readBeeLogs, subscribeLogServerRequests } from './logger'
import { getPath, paths } from './path'
import { port } from './port'
import { getStatus } from './status'
import { swap } from './swap'

const UI_DIST = path.join(__dirname, '..', '..', 'ui')
const ETHERJOT_DIST = path.join(__dirname, '..', '..', 'etherjot')

const AUTO_UPDATE_ENABLED_PLATFORMS = ['darwin', 'win32']

export function runServer() {
  const app = new Koa()
  logger.info(`Serving UI from path: ${UI_DIST}`)
  app.use(mount('/dashboard', serve(UI_DIST)))
  logger.info(`Serving Etherjot from path: ${ETHERJOT_DIST}`)
  app.use(mount('/etherjot', serve(ETHERJOT_DIST)))

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
      const response = await fetch('https://tokenservice.ethswarm.org/token_price')
      context.body = await response.text()
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
  router.get('/peers', async context => {
    try {
      const response = await fetch('http://127.0.0.1:1633/peers')
      const { peers } = await response.json()

      context.body = { connections: peers ? peers.length || 0 : 0 }
    } catch (error) {
      logger.error(error)
      context.body = { connections: 0 }
    }
  })
  router.post('/config', context => {
    writeConfigYaml(context.request.body as Record<string, string>)
    context.body = readConfigYaml()
  })
  router.get('/config', context => {
    context.body = readConfigYaml()
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
    await sendBzzTransaction(privateKeyString, address, '50000000000000000', blockchainRpcEndpoint)
    await sendNativeTransaction(privateKeyString, address, '1000000000000000000', blockchainRpcEndpoint)
    context.body = { success: true }
  })
  router.post('/swap', async context => {
    const config = readConfigYaml()
    const blockchainRpcEndpoint = Reflect.get(config, 'blockchain-rpc-endpoint') as string
    const privateKeyString = await getPrivateKey()
    try {
      await swap(privateKeyString, (context.request.body as Record<string, string>).dai, '10000', blockchainRpcEndpoint)
      context.body = { success: true }
    } catch (error) {
      logger.error(error)
      context.status = 500
      context.body = { message: 'Failed to swap', error }
    }
  })
  router.post('/open/logs', async context => {
    opener(paths.log)
    context.body = { success: true }
  })
  router.post('/open/data-dir', async context => {
    const config = readConfigYaml()
    opener(config['data-dir'])
    context.body = { success: true }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  const server = app.listen(port.value)
  subscribeLogServerRequests(server)
}

async function getPrivateKey(): Promise<string> {
  const v3 = await readFile(getPath(path.join('data-dir', 'keys', 'swarm.key')), 'utf-8')
  const wallet = await Wallet.fromV3(v3, readWalletPasswordOrThrow())
  const privateKeyString = wallet.getPrivateKeyString()

  return privateKeyString
}
