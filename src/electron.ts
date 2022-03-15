import { app, Menu, shell, Tray } from 'electron'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { port } from './server'
import { getStatus } from './status'

let tray: null | Tray

export function rebuildElectronTray() {
    if (!tray) {
        return
    }
    if (getStatus().status !== 2) {
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Open Installer', click: () => shell.openExternal(`http://localhost:${port}/installer/`) },
            { type: 'separator' },
            {
                label: 'Exit',
                click: async () => {
                    app.quit()
                }
            }
        ])
        tray.setContextMenu(contextMenu)
        return
    }
    const contextMenu = Menu.buildFromTemplate([
        {
            label: BeeManager.isRunning() ? 'Stop Bee' : 'Start Bee',
            click: () => {
                if (BeeManager.isRunning()) {
                    BeeManager.stop()
                } else {
                    runLauncher()
                }
            }
        },
        { type: 'separator' },
        { label: 'Open Web UI', click: () => shell.openExternal(`http://localhost:${port}/dashboard/#/`) },
        { type: 'separator' },
        {
            label: 'Exit',
            click: async () => {
                BeeManager.stop()
                await BeeManager.waitForSigtermToFinish()
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)
}

export function runElectronTray() {
    app.whenReady().then(() => {
        app.dock.setIcon('icon.png')
        app.dock.hide()
        tray = new Tray('tray.png')
        rebuildElectronTray()
    })
}
