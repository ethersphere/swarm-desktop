const { runLauncher } = require('./src/launcher')
const { runElectronTray } = require('./src/electron')
const { runStaticServer } = require('./src/static-server')

runLauncher()
runElectronTray()
runStaticServer()
