import { BrowserWindow, app } from 'electron'
import * as path from 'path'
import { logger } from './logger'

export async function initSplash(): Promise<() => void> {
  return new Promise((resolve, reject) => {
    app.on('ready', () => {
      const splashImage = path.resolve(__dirname, '..', '..', '..', 'assets', 'splash.html')
      logger.info(`Serving splash screen from path ${splashImage}`)

      const splash = new BrowserWindow({ width: 800, height: 600, frame: false, alwaysOnTop: true })
      splash.loadURL(`file://${splashImage}`).catch(reject)

      resolve(() => splash.hide())
    })
  })
}
