import { BrowserWindow, desktopCapturer, dialog, ipcMain, nativeImage } from 'electron'
import { logger } from '../../logger'
import { createCropWindow } from './cropWindow/crop'
import type { CropImageArgs } from './cropWindow/cropPreload'
import { createPreviewWindow } from './previewWindow/preview'
import { getScreenSize } from './utils'

let previewWindow: BrowserWindow

function takeScreenshotImplementation() {
  let imgDataURL: string

  ipcMain.handle('take-screenshot', async evnt => {
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
      // evnt.sender.close()
      if (img) {
        imgDataURL = img.toDataURL()
        previewWindow = createPreviewWindow(imgDataURL)
      }
    } catch (err) {
      logger.error('Failed to take Screenshot: ', err.message)
      dialog.showErrorBox('Error', 'Failed to take screenshot.')
    }
  })

  ipcMain.on('open-crop-window', (_, imgSrc) => {
    createCropWindow(imgSrc)
  })

  ipcMain.on('crop-image', async (_, args: CropImageArgs) => {
    const img = nativeImage.createFromDataURL(args.imgDataURL)

    const croppedImg = img.crop({
      x: args.x,
      y: args.y,
      width: args.width,
      height: args.height,
    })

    if (previewWindow) {
      previewWindow.webContents.send('update-with-cropped-image', croppedImg.toDataURL())
    }
  })
}

export function runScreenshotImpl() {
  takeScreenshotImplementation()
}
