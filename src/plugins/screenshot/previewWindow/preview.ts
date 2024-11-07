import { BrowserWindow, app } from 'electron/main'
import path from 'node:path'
import { logger } from '../../..//logger'
import { getScreenSize } from '../utils'

export function createPreviewWindow(imgDataURL: string) {
  const { defaultScreenSize } = getScreenSize()

  const prvWindow = new BrowserWindow({
    width: defaultScreenSize.width,
    height: defaultScreenSize.height,
    webPreferences: {
      preload: path.join(__dirname, 'previewPreload.js'),
    },
  })

  const previewFilePath = path.join(app.getAppPath(), 'src', 'plugins', 'screenshot', 'previewWindow', 'preview.html')
  prvWindow.loadFile(previewFilePath).catch(err => {
    logger.error('Failed to load preview.html: ', err.message)
  })

  prvWindow.webContents.openDevTools()
  prvWindow.webContents.on('did-finish-load', () => {
    prvWindow.webContents.send('image-data-url', imgDataURL)
  })

  return prvWindow
}
