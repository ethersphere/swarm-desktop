const Router = require('@koa/router')
const Koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const context = require('koa/lib/context')
const { existsSync, readFileSync } = require('fs')
const { createConfigFileAndAddress, createInitialTransaction } = require('./launcher')
const { rebuildElectronTray } = require('./electron')

function getStatus() {
    if (!existsSync('config.yaml') || !existsSync('data-dir')) {
        return {
            status: 0
        }
    }
    const config = readFileSync('config.yaml', 'utf-8')
    if (!config.includes('block-hash')) {
        const { address } = JSON.parse(readFileSync('data-dir/keys/swarm.key'))
        return {
            address,
            status: 1
        }
    }
    return {
        status: 2
    }
}

function main() {
    const app = new Koa()
    app.use(async (context, next) => {
        context.set('Access-Control-Allow-Origin', 'http://localhost:5002')
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
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(5001)
}

module.exports = {
    getStatus,
    runApiServer: main
}
