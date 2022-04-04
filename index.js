const { shell } = require('electron')
const { getApiKey } = require('./src/api-key')
const { runElectronTray } = require('./src/electron')
const { runLauncher } = require('./src/launcher')
const { findFreePort, port } = require('./src/port')
const { runServer } = require('./src/server')
const { getStatus } = require('./src/status')

async function main() {
    await findFreePort()
    runServer()
    runElectronTray()
    if (getStatus().status === 2) {
        runLauncher()
    } else {
        shell.openExternal(`http://localhost:${port.value}/installer/?v=${getApiKey()}`)
    }
}

main()
