const { app, Tray, Menu, shell } = require('electron')
const { getApiKey } = require('./api-key')
const { runLauncher } = require('./launcher')
const { BeeManager } = require('./lifecycle')
const { resolvePath } = require('./path')
const { port } = require('./port')
const { getStatus } = require('./status')

let tray

function rebuildElectronTray() {
    if (!tray) {
        return
    }
    if (getStatus().status !== 2) {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Open Installer',
                click: () => shell.openExternal(`http://localhost:${port.value}/installer/?v=${getApiKey()}`)
            },
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
        {
            label: 'Open Web UI',
            click: () => shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${getApiKey()}#/`)
        },
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

function main() {
    app.whenReady().then(() => {
        app.dock.setIcon(resolvePath('icon.png'))
        app.dock.hide()
        tray = new Tray(resolvePath('tray.png'))
        rebuildElectronTray()
    })
}

module.exports = {
    runElectronTray: main,
    rebuildElectronTray
}
