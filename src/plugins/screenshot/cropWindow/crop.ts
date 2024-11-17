import { BrowserWindow, app } from 'electron'
import path from 'node:path'
import { logger } from '../../..//logger'
import { previewWindow } from '../previewWindow/preview'
import { getScreenSize } from '../utils'

export function createCropWindow(imgSrc: string) {
  const { defaultScreenSize } = getScreenSize(2.5)

  let cropWindow = new BrowserWindow({
    width: defaultScreenSize.width,
    height: defaultScreenSize.height,
    parent: previewWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'cropPreload.js'),
    },
  })

  const cropFilePath = path.join(app.getAppPath(), 'src', 'plugins', 'screenshot', 'cropWindow', 'crop.html')
  cropWindow.loadFile(cropFilePath).catch(err => {
    logger.info('Failed to load crop.html: ', err.message)
  })

  cropWindow.webContents.openDevTools()

  cropWindow.once('ready-to-show', () => {
    cropWindow.show()
  })

  cropWindow.on('closed', () => {
    cropWindow = null
  })

  cropWindow.webContents.on('did-finish-load', () => {
    cropWindow.webContents.send('load-image-for-cropping', imgSrc)
  })
}
