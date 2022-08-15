import Router from '@koa/router'
import { captureException } from '@sentry/electron'
import Wallet from 'ethereumjs-wallet'
import { readFile } from 'fs/promises'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import mount from 'koa-mount'
import serve from 'koa-static'
import fetch from 'node-fetch'
import * as path from 'path'
import { URL } from 'url'

import PACKAGE_JSON from '../package.json'
import { getApiKey } from './api-key'
import { sendBzzTransaction, sendNativeTransaction } from './blockchain'
import { readConfigYaml, writeConfigYaml } from './config-yaml'
import { rebuildElectronTray } from './electron'
import { createConfigFileAndAddress, createInitialTransaction, runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { logger, readBeeDesktopLogs, readBeeLogs, subscribeLogServerRequests } from './logger'
import { getPath } from './path'
import { port } from './port'
import { getStatus } from './status'
import { swap } from './swap'
import { bufferRequest } from './utility'

const INSTALLER_DIST = path.join(__dirname, '..', '..', 'ui')

const AUTO_UPDATE_ENABLED_PLATFORMS = ['darwin', 'win32']

export function runServer() {
  const app = new Koa()
  logger.info(`Serving installer from path: ${INSTALLER_DIST}`)
  app.use(mount('/installer', serve(INSTALLER_DIST)))

  // require.resolve() gives you the `main` entrypoint so for Dashboard `lib/App.js`.
  const dashboardPath = path.join(path.dirname(require.resolve('@ethersphere/bee-dashboard')), '..', 'build')
  logger.info(`Serving dashboard from path: ${dashboardPath}`)
  app.use(mount('/dashboard', serve(dashboardPath)))

  app.use(async (context, next) => {
    const corsOrigin = process.env.NODE_ENV === 'development' ? '*' : `http://localhost:${port.value}`
    context.set('Access-Control-Allow-Origin', corsOrigin)
    context.set('Access-Control-Allow-Credentials', 'true')
    context.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Referer, Baggage, Sentry-Trace',
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

  /**
   * This is proxy endpoint for Sentry to circumvent ad-blockers
   * @see https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option
   */
  router.all('/sentry', async context => {
    // OPTION request is used to verify that Desktop can proxy the requests
    if (context.request.method.toLowerCase() === 'options') {
      context.status = 204

      return
    }

    try {
      // We can't use the `context.request.body` as the incoming request is not valid JSON
      // It is multiline string where each line contain a JSON field and because of that the `koa-bodyparser`
      // is not able to correctly detect and parse the body and because of that nothing is attached.
      // So we need to Buffer the body into string ourselves.
      const envelope = await bufferRequest(context.req)
      const pieces = envelope.split('\n')
      const header = JSON.parse(pieces[0])
      const dnsUrl = new URL(header.dsn)
      const projectId = dnsUrl.pathname.endsWith('/') ? dnsUrl.pathname.slice(0, -1) : dnsUrl.pathname
      const url = `https://${dnsUrl.host}/api/${projectId}/envelope/`
      const response = await fetch(url, {
        method: 'POST',
        body: envelope,
      })

      context.body = await response.json()
    } catch (e) {
      logger.error(e)
      captureException(e)

      context.status = 400
      context.body = { status: 'invalid request' }
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
      const response = await fetch('http://127.0.0.1:1635/peers')
      const { peers } = await response.json()

      context.body = { connections: peers ? peers.length || 0 : 0 }
    } catch (error) {
      logger.error(error)
      context.body = { connections: 0 }
    }
  })
  router.post('/setup/address', async context => {
    await createConfigFileAndAddress()
    context.body = getStatus()
  })
  router.post('/setup/transaction', async context => {
    await createInitialTransaction()
    rebuildElectronTray()
    context.body = getStatus()
  })
  router.post('/config', context => {
    writeConfigYaml(context.request.body)
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
    const swapEndpoint = Reflect.get(config, 'swap-endpoint')
    const privateKeyString = await getPrivateKey()
    const { address } = context.params
    await sendBzzTransaction(privateKeyString, address, '50000000000000000', swapEndpoint)
    await sendNativeTransaction(privateKeyString, address, '1000000000000000000', swapEndpoint)
    context.body = { success: true }
  })
  router.post('/swap', async context => {
    const config = readConfigYaml()
    const swapEndpoint = Reflect.get(config, 'swap-endpoint')
    const privateKeyString = await getPrivateKey()
    await swap(privateKeyString, context.request.body.dai, '10000', swapEndpoint)
    context.body = { success: true }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  const server = app.listen(port.value)
  subscribeLogServerRequests(server)
}

async function getPrivateKey(): Promise<string> {
  const v3 = await readFile(getPath(path.join('data-dir', 'keys', 'swarm.key')), 'utf-8')
  const wallet = await Wallet.fromV3(v3, 'Test')
  const privateKeyString = wallet.getPrivateKeyString()

  return privateKeyString
}
