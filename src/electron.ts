import { app, Menu, Tray } from 'electron'
import { openDashboardInBrowser, openInstallerInBrowser } from './browser'
import { runDownloader } from './downloader'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { createNotification } from './notify'
import { getPath } from './path'
import { getStatus } from './status'

let tray: Tray

export function rebuildElectronTray() {
  if (!tray) {
    return
  }

  if (!getStatus().hasInitialTransaction) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Installer',
        click: openInstallerInBrowser,
      },
      { type: 'separator' },
      {
        label: 'Redownload assets',
        click: redownloadAssets,
      },
      {
        label: 'Quit',
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
      label: 'Open Web UI',
      click: openDashboardInBrowser,
    },
    { type: 'separator' },
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
      label: 'Redownload assets',
      click: redownloadAssets,
    },
    { type: 'separator' },
    {
      label: 'Quit',
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
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', () => {
      createNotification('Swarm is already running. Please close the previous instance first.')
    })
  }

  app.whenReady().then(() => {
    if (app.dock) {
      app.dock.setIcon(getPath('icon.png'))
      app.dock.hide()
    }
    tray = new Tray(getPath('trayTemplate.png'))
    rebuildElectronTray()
  })
}

async function redownloadAssets(): Promise<void> {
  if (BeeManager.isRunning()) {
    BeeManager.stop()
  }
  await runDownloader(true)
  createNotification('New assets fetched successfully')

  if (getStatus().hasInitialTransaction) {
    runLauncher()
  } else {
    openInstallerInBrowser()
  }
}
