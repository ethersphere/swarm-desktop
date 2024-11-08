import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { logger } from '../../../logger'

export function screenCaptureWindow() {
  const initWindow = new BrowserWindow({
    width: 600, // 160
    height: 400, // 60
    modal: true,
    frame: false,
    resizable: false,
    movable: true,
    backgroundColor: '#333',
    opacity: 0.95,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const initFilePath = path.join(
    app.getAppPath(),
    'src',
    'plugins',
    'screenshot',
    'screenCaptureWindow',
    'capture.html',
  )

  initWindow.loadFile(initFilePath).catch(err => {
    logger.info('Failed to load index.html: ', err)
  })

  initWindow.webContents.openDevTools()

  return initWindow
}
