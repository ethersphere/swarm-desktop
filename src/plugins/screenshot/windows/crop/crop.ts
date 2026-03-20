import { app, BrowserWindow } from 'electron'
import path from 'node:path'

import { logger } from '../../../../logger'
import { getScreenSize } from '../../utils'
import { previewWindow } from '../preview/preview'

export function createCropWindow(imgSrc: string) {
  const { defaultScreenSize } = getScreenSize(2.5)

  let cropWindow = new BrowserWindow({
    width: defaultScreenSize.width,
    height: defaultScreenSize.height,
    parent: previewWindow,
    modal: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'crop-preload.js'),
    },
  })

  const cropFilePath = path.join(app.getAppPath(), 'src', 'plugins', 'screenshot', 'windows', 'crop', 'crop.html')
  cropWindow.loadFile(cropFilePath).catch(err => {
    logger.info('Failed to load crop.html: ', err.message)
  })

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
