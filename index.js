const { shell } = require('electron')
const { runElectronTray } = require('./src/electron')
const { runLauncher } = require('./src/launcher')
const { port, runServer } = require('./src/server')
const { getStatus } = require('./src/status')

if (getStatus().status === 2) {
    runLauncher()
} else {
    shell.openExternal(`http://localhost:${port}/installer/`)
}
runElectronTray()
runServer()
