const Router = require('@koa/router')
const Koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const serve = require('koa-static')
const { writeConfigYaml, readConfigYaml } = require('./config-yaml')
const { createInitialTransaction, createConfigFileAndAddress, runLauncher } = require('./launcher')
const { BeeManager } = require('./lifecycle')
const { getStatus } = require('./status')

const port = 5000

function runServer() {
    const app = new Koa()
    app.use(serve('static'))
    app.use(async (context, next) => {
        context.set('Access-Control-Allow-Origin', `*`)
        context.set('Access-Control-Allow-Credentials', 'true')
        context.set(
            'Access-Control-Allow-Headers',
            'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
        )
        context.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH')
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
        const { rebuildElectronTray } = require('./electron')
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

module.exports = { runServer, port }
