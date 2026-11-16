import { app, BrowserWindow } from 'electron'

import { logger } from './logger'
import { getAssetPath } from './path'

export function showCompromiseNotice(firstSeen: Date): void {
  const notice = new BrowserWindow({
    width: 680,
    height: 720,
    icon: getAssetPath('icon.png'),
    alwaysOnTop: true,
    autoHideMenuBar: true,
    show: false,
  })

  notice.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  notice.webContents.on('will-navigate', event => event.preventDefault())

  notice.once('ready-to-show', () => {
    notice.show()

    if (process.platform === 'darwin') {
      app.focus({ steal: true })
    }
  })

  notice
    .loadFile(getAssetPath('compromise-notice.html'), {
      query: { platform: process.platform, firstSeen: firstSeen.toISOString() },
    })
    .catch(() => logger.error('compromise notice: failed to load'))
}
