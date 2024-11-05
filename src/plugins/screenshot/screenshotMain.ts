import { desktopCapturer, dialog, ipcMain, nativeImage } from 'electron'
import { logger } from '../../logger'
import { getScreenSize } from './utils'

function takeScreenshotImplementation() {
  return ipcMain.handle('take-screenshot', async evnt => {
    try {
      const { height, width, scaleFactor } = getScreenSize()
      const source = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: Math.round(width * scaleFactor),
          height: Math.round(height * scaleFactor),
        },
      })

      const img = nativeImage.createFromBuffer(source[0].thumbnail.toPNG())
      //TODO: check how to close this window
      evnt.sender.close()

      return img.toDataURL()
    } catch (err) {
      logger.error('Failed to take Screenshot: ', err.message)
      dialog.showErrorBox('Error', 'Failed to take screenshot.')
    }
  })
}

export function runScreenshotImpl() {
  takeScreenshotImplementation()
}
