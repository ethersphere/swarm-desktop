import { desktopCapturer, dialog, ipcMain, nativeImage } from 'electron'

import { logger } from '../../logger'

import { getPostageBatches, handleFileUpload, nodeIsConnected } from './utils/bee-api'
import { captureWindow } from './windows/capture/capture'
import { createCropWindow } from './windows/crop/crop'
import type { CropImageArgs } from './windows/crop/crop-preload'
import { createPreviewWindow, previewWindow } from './windows/preview/preview'
import { getScreenSize } from './utils'

function takeScreenshotImplementation() {
  let imgDataURL: string

  ipcMain.handle('take-screenshot', async () => {
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

      if (img) {
        imgDataURL = img.toDataURL()
        createPreviewWindow(imgDataURL)
      }
    } catch (err) {
      logger.error('Failed to take Screenshot: ', err.message)
      dialog.showErrorBox('Error', 'Failed to take screenshot.')
    }
  })

  ipcMain.on('hide-capture-window', () => {
    captureWindow.hide()
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

  ipcMain.handle('node-is-connected', async () => {
    return await nodeIsConnected()
  })

  ipcMain.handle('get-all-postage-batch', async () => {
    return await getPostageBatches()
  })

  ipcMain.on('create-postage-stamp', evnt => {
    const getAllPostageBatchIntervalID = setInterval(async () => {
      try {
        const ps = await getPostageBatches()

        if (ps.length) {
          clearInterval(getAllPostageBatchIntervalID)
          evnt.sender.send('update-postage-stamp-state', ps)
        }
      } catch (err) {
        clearInterval(getAllPostageBatchIntervalID)
        logger.error(err.message)
        evnt.sender.send('update-postage-stamp-state', err.message)
      } finally {
        if (getAllPostageBatchIntervalID) {
          clearInterval(getAllPostageBatchIntervalID)
        }
      }
    }, 5000)
  })

  ipcMain.handle('upload-to-swarm', async (e, args) => {
    try {
      const img = nativeImage.createFromDataURL(args.imgDataURL)
      args.imgBuffer = img.toPNG()

      if (!args.name) {
        const date = new Date().toISOString()
        args.name = date.replace(/\.|:/gi, '') + '.png'
      }
      delete args.imgDataURL

      const result = await handleFileUpload(args)
      delete result.tagUid

      if (result.reference) {
        e.sender.send('upload-result', JSON.stringify({ ...result }))
      }
    } catch (err) {
      logger.error('handleFileUpload: ', err.message)
      throw err
    }
  })
}

export function runScreenshot() {
  takeScreenshotImplementation()
}
