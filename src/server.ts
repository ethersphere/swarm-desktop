import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import Router from 'koa-router'
import serve from 'koa-static'
import { readConfigYaml, writeConfigYaml } from './config-yaml'
import { rebuildElectronTray } from './electron'
import { createConfigFileAndAddress, createInitialTransaction, runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { getStatus } from './status'

export const port = 5000

export function runServer(): void {
    const app = new Koa()
    app.use(serve('static'))
    app.use(async (context, next) => {
        context.set('Access-Control-Allow-Origin', `http://localhost:${port}`)
        context.set('Access-Control-Allow-Credentials', 'true')
        context.set(
            'Access-Control-Allow-Headers',
            'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
        )
        context.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
        await next()
    })
    app.use(koaBodyparser())
    const router = new Router()
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
    router.patch('/config', context => {
        writeConfigYaml(context.request.body)
        context.body = readConfigYaml()
    })
    router.post('/restart', async context => {
        BeeManager.stop()
        await BeeManager.waitForSigtermToFinish()
        runLauncher()
        context.body = { success: true }
    })
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(port)
}
