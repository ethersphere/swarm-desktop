import { app, Menu, Tray } from 'electron'
import Notifier from 'node-notifier'
import { openDashboardInBrowser, openInstallerInBrowser } from './browser'
import { runDownloader } from './downloader'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
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
      click: openDashboardInBrowser,
    },
    { type: 'separator' },
    {
      label: 'Redownload assets',
      click: redownloadAssets,
    },
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
    if (app.dock) {
      app.dock.setIcon(getPath('icon.png'))
      app.dock.hide()
    }
    tray = new Tray(getPath('tray.png'))
    rebuildElectronTray()
  })
}

async function redownloadAssets(): Promise<void> {
  if (BeeManager.isRunning()) {
    BeeManager.stop()
  }
  await runDownloader(true)
  Notifier.notify({ title: 'Swarm', message: 'New assets fetched successfully' })

  if (getStatus().hasInitialTransaction) {
    runLauncher()
  } else {
    openInstallerInBrowser()
  }
}
