import { app, BrowserWindow } from 'electron'
import path from 'node:path'

import { logger } from '../../../../logger'

let self: BrowserWindow

function screenCaptureWindow() {
  self = new BrowserWindow({
    width: 160,
    height: 60,
    frame: false,
    resizable: false,
    backgroundColor: '#333',
    opacity: 0.95,
    webPreferences: {
      preload: path.join(__dirname, 'capture-preload.js'),
    },
  })

  const initFilePath = path.join(app.getAppPath(), 'src', 'plugins', 'screenshot', 'windows', 'capture', 'capture.html')

  self.loadFile(initFilePath).catch(err => {
    logger.info('Failed to load index.html: ', err)
  })

  return self
}

const show = () => {
  if (self && !self.isVisible()) {
    self.show()
  }
}

const hide = () => {
  if (self && self.isVisible()) {
    self.hide()
  }
}

const close = () => {
  if (self) {
    self.close()
  }
}

export const captureWindow = {
  hide,
  show,
  close,
  screenCaptureWindow,
}
