import { app, BrowserWindow } from 'electron'
import path from 'node:path'

import { logger } from '../../../..//logger'
import { getScreenSize } from '../../utils'
import { captureWindow } from '../capture/capture'

let previewWindow: BrowserWindow

function createPreviewWindow(imgDataURL: string) {
  const { defaultScreenSize } = getScreenSize(2.5)

  previewWindow = new BrowserWindow({
    width: defaultScreenSize.width,
    height: defaultScreenSize.height,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preview-preload.js'),
    },
  })

  const previewFilePath = path.join(
    app.getAppPath(),
    'src',
    'plugins',
    'screenshot',
    'windows',
    'preview',
    'preview.html',
  )
  previewWindow.loadFile(previewFilePath).catch(err => {
    logger.error('Failed to load preview.html: ', err.message)
  })

  previewWindow.webContents.on('did-finish-load', () => {
    previewWindow.webContents.send('image-data-url', imgDataURL)
  })

  previewWindow.on('close', () => {
    captureWindow.close()
  })

  return previewWindow
}

export { createPreviewWindow, previewWindow }
