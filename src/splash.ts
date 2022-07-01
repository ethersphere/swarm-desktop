import { BrowserWindow, app } from 'electron'
import * as path from 'path'
import { logger } from './logger'

export async function initSplash(): Promise<() => void> {
  return new Promise((resolve, reject) => {
    app.on('ready', () => {
      const splashImage = path.resolve(__dirname, '..', '..', '..', 'assets', 'splash.html')
      logger.info(`Serving splash screen from path ${splashImage}`)

      const splash = new BrowserWindow({ width: 810, height: 610, transparent: true, frame: false, alwaysOnTop: true })
      splash.loadURL(`file://${splashImage}`).catch(reject)

      resolve(() => splash.hide())
    })
  })
}
