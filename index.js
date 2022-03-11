const { shell } = require('electron')
const { runApiServer } = require('./src/api-server')
const { runElectronTray } = require('./src/electron')
const { runLauncher } = require('./src/launcher')
const { runStaticServer } = require('./src/static-server')

if (require('./src/api-server').getStatus().status === 2) {
    runLauncher()
} else {
    shell.openExternal('http://localhost:5002')
}
runElectronTray()
runStaticServer()
runApiServer()
