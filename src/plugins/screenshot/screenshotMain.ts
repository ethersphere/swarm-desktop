import { PostageBatch } from '@ethersphere/bee-js'
import { BrowserWindow, desktopCapturer, dialog, ipcMain, nativeImage } from 'electron'
import { logger } from '../../logger'
import { createCropWindow } from './cropWindow/crop'
import type { CropImageArgs } from './cropWindow/cropPreload'
import { createPreviewWindow } from './previewWindow/preview'
import { captureWindow } from './screenCaptureWindow/capture'
import { getScreenSize } from './utils'
import { BEE_DASHBOARD_URL, getAllPostageBatch, handleFileUpload, nodeIsConnected } from './utils/beeApi'

let previewWindow: BrowserWindow

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
        previewWindow = createPreviewWindow(imgDataURL)
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
    return await getAllPostageBatch()
  })

  ipcMain.on('create-postage-stamp', evnt => {
    const { height, width, scaleFactor } = getScreenSize()

    const beeDashboarWin = new BrowserWindow({
      width: (width / 3) * scaleFactor,
      height: (height / 3) * scaleFactor,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    beeDashboarWin.webContents.loadURL(BEE_DASHBOARD_URL)
    beeDashboarWin.webContents.openDevTools() // TODO: remove before building for production

    let ps: PostageBatch[]
    const getAllPostageBatchIntervalID = setInterval(async () => {
      try {
        ps = await getAllPostageBatch()

        if (ps.length) {
          clearInterval(getAllPostageBatchIntervalID)
          beeDashboarWin.close()
        }
      } catch (err) {
        clearInterval(getAllPostageBatchIntervalID)
        logger.error(err.message)
      }
    }, 5000)

    // Handle when closed
    beeDashboarWin.on('closed', () => {
      clearInterval(getAllPostageBatchIntervalID)
      evnt.sender.send('update-postage-stamp-state', ps)
    })
  })

  ipcMain.handle('upload-to-swarm', async (e, args) => {
    try {
      const img = nativeImage.createFromDataURL(args.imgDataURL)
      args.imgBuffer = img.toPNG()

      if (!args.name) {
        const day = new Date().toDateString().slice(0, 3)
        const date = new Date().toISOString()
        args.name = date.replace(/\./i, day) + '.png'
      }
      delete args.imgDataURL

      const refCid = await handleFileUpload(args)

      if (refCid.reference) {
        e.sender.send('upload-result-with-cid', JSON.stringify({ ...refCid, cid: refCid.cid() }))
      }
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  })
}

export function runScreenshotImpl() {
  takeScreenshotImplementation()
}
