import Router from '@koa/router'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import { getApiKey } from './api-key'
import { writeConfigYaml, readConfigYaml } from './config-yaml'
import { createInitialTransaction, createConfigFileAndAddress, runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { resolvePath } from './path'
import { port } from './port'
import { getStatus } from './status'
import { rebuildElectronTray } from './electron'
import { subscribeLogServerRequests } from './logger'

function aunthenticated(context: Koa.Context): boolean {
  const { authorization } = context.headers

  if (authorization !== getApiKey()) {
    context.status = 401
    context.body = 'Unauthorized'

    return false
  }

  return true
}

export function runServer() {
  const app = new Koa()
  app.use(serve(resolvePath('static')))
  app.use(async (context, next) => {
    context.set('Access-Control-Allow-Origin', `http://localhost:${port.value}`)
    context.set('Access-Control-Allow-Credentials', 'true')
    context.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
    context.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    await next()
  })
  app.use(koaBodyparser())
  const router = new Router()
  router.get('/info', context => {
    context.body = { name: 'bee-desktop' }
  })
  router.get('/status', context => {
    if (!aunthenticated(context)) return
    context.body = getStatus()
  })
  router.post('/setup/address', async context => {
    if (!aunthenticated(context)) return
    await createConfigFileAndAddress()
    context.body = getStatus()
  })
  router.post('/setup/transaction', async context => {
    if (!aunthenticated(context)) return
    await createInitialTransaction()
    rebuildElectronTray()
    context.body = getStatus()
  })
  router.post('/config', context => {
    if (!aunthenticated(context)) return
    writeConfigYaml(context.request.body)
    context.body = readConfigYaml()
  })
  router.get('/config', context => {
    if (!aunthenticated(context)) return
    context.body = readConfigYaml()
  })
  router.post('/restart', async context => {
    if (!aunthenticated(context)) return
    BeeManager.stop()
    await BeeManager.waitForSigtermToFinish()
    runLauncher()
    context.body = { success: true }
  })
  app.use(router.routes())
  app.use(router.allowedMethods())
  const server = app.listen(port.value)
  subscribeLogServerRequests(server)
}
