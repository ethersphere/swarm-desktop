const { app, Tray, Menu, shell } = require('electron')
const { runLauncher } = require('./launcher')
const { BeeManager } = require('./lifecycle')

let tray

function rebuildElectronTray() {
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
        { label: 'Open Web UI', click: () => shell.openExternal('http://localhost:5000') },
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
        tray = new Tray('tray.png')
        rebuildElectronTray()
    })
}

module.exports = {
    runElectronTray: main,
    rebuildElectronTray
}
