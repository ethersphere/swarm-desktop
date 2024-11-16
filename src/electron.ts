import { app, BrowserWindow, Menu, nativeTheme, Tray } from 'electron'
import opener from 'opener'
import { openDashboardInBrowser, openEtherjotInBrowser } from './browser'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { createNotification } from './notify'
import { getAssetPath, paths } from './path'
import * as screenshot from './plugins/screenshot'

let tray: Tray
let sCaptureWindow: BrowserWindow

export function rebuildElectronTray() {
  if (!tray) {
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
      type: 'submenu',
      label: 'Apps',
      submenu: [
        {
          label: 'Etherjot (demo)',
          click: openEtherjotInBrowser,
        },
      ],
    },
    { type: 'separator' },
    {
      label: 'Swarm Screenshot',
      click: () => {
        const { captureWindow, previewWindow } = screenshot

        if (sCaptureWindow && !sCaptureWindow.isDestroyed() && sCaptureWindow.isVisible()) {
          sCaptureWindow.focus()

          return
        }

        if (previewWindow && !previewWindow.isDestroyed() && previewWindow.isVisible()) {
          previewWindow.focus()

          return
        }

        if (!sCaptureWindow || sCaptureWindow.isDestroyed()) {
          sCaptureWindow = captureWindow.screenCaptureWindow()
        }
        sCaptureWindow.show()
      },
    },
    {
      label: 'Logs',
      click: async () => {
        opener(paths.log)
      },
    },
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

function getTrayIcon() {
  if (process.platform === 'darwin') {
    // on macOS the resolution and dark/light is managed automatically
    return getAssetPath('trayTemplate.png')
  }

  const isDark = nativeTheme.shouldUseDarkColors

  if (isDark) {
    return getAssetPath('icon-inv.png')
  }

  return getAssetPath('icon.png')
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
      app.dock.setIcon(getAssetPath('icon.png'))
      app.dock.hide()
    }

    tray = new Tray(getTrayIcon())
    rebuildElectronTray()
  })
}
