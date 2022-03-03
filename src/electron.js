const { app, Tray, Menu, shell } = require('electron')

let tray

function main() {
    app.whenReady().then(() => {
        tray = new Tray('tray.png')
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Open Web UI', click: () => shell.openExternal('http://127.0.0.1:5000') }
        ])
        tray.setContextMenu(contextMenu)
    })
}

module.exports = {
    runElectronTray: main
}
