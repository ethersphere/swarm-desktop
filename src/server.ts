import Router from '@koa/router'
import Wallet from 'ethereumjs-wallet'
import { readFile } from 'fs/promises'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import { join } from 'path'
import { getApiKey } from './api-key'
import { sendBzzTransaction, sendNativeTransaction } from './blockchain'
import { readConfigYaml, writeConfigYaml } from './config-yaml'
import { rebuildElectronTray } from './electron'
import { createConfigFileAndAddress, createInitialTransaction, runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { subscribeLogServerRequests } from './logger'
import { getPath } from './path'
import { port } from './port'
import { getStatus } from './status'
import { swap } from './swap'
import { wait } from './utility'

export function runServer() {
  const app = new Koa()
  app.use(serve(getPath('static')))
  app.use(async (context, next) => {
    context.set('Access-Control-Allow-Origin', `http://localhost:${port.value}`)
    context.set('Access-Control-Allow-Credentials', 'true')
    context.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
    context.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    await next()
  })
  app.use(koaBodyparser())
  const router = new Router()

  // Open endpoints without any authentication
  router.get('/info', context => {
    context.body = { name: 'bee-desktop' }
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
    await wait(15000)
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
  const v3 = await readFile(getPath(join('data-dir', 'keys', 'swarm.key')), 'utf-8')
  const wallet = await Wallet.fromV3(v3, 'Test')
  const privateKeyString = wallet.getPrivateKeyString()

  return privateKeyString
}
