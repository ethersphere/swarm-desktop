const { app, Tray, Menu, shell } = require('electron')
const { apiKey } = require('./api-key')
const { runLauncher } = require('./launcher')
const { BeeManager } = require('./lifecycle')
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
                click: () => shell.openExternal(`http://localhost:${port.value}/installer/?v=${apiKey}`)
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
            click: () => shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${apiKey}#/`)
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
        app.dock.setIcon('icon.png')
        app.dock.hide()
        tray = new Tray('tray.png')
        rebuildElectronTray()
    })
}

module.exports = {
    runElectronTray: main,
    rebuildElectronTray
}
