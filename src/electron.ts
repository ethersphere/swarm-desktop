import { app, Tray, Menu, shell } from 'electron'
import { getApiKey } from './api-key'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { resolvePath } from './path'
import { port } from './port'
import { getStatus } from './status'

let tray: Tray

export function rebuildElectronTray() {
  if (!tray) {
    return
  }

  if (getStatus().status !== 2) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Installer',
        click: async () => shell.openExternal(`http://localhost:${port.value}/installer/?v=${getApiKey()}`),
      },
      { type: 'separator' },
      {
        label: 'Exit',
        click: async () => {
          app.quit()
        },
      },
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
      },
    },
    { type: 'separator' },
    {
      label: 'Open Web UI',
      click: async () => shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${getApiKey()}#/`),
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: async () => {
        BeeManager.stop()
        await BeeManager.waitForSigtermToFinish()
        app.quit()
      },
    },
  ])
  tray.setContextMenu(contextMenu)
}

export function runElectronTray() {
  app.whenReady().then(() => {
    app.dock.setIcon(resolvePath('icon.png'))
    app.dock.hide()
    tray = new Tray(resolvePath('tray.png'))
    rebuildElectronTray()
  })
}
