import { shell } from 'electron'
import { runElectronTray } from './src/electron'
import { runLauncher } from './src/launcher'
import { port, runServer } from './src/server'
import { getStatus } from './src/status'

if (getStatus().status === 2) {
    runLauncher()
} else {
    shell.openExternal(`http://localhost:${port}/installer/`)
}
runElectronTray()
runServer()
