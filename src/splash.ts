import { app, BrowserWindow } from 'electron'
import * as path from 'path'

import { logger } from './logger'

export interface Splash {
  hide: () => void
  setMessage: (msg: string) => void
}

export async function initSplash(): Promise<Splash> {
  return new Promise((resolve, reject) => {
    app.on('ready', () => {
      const splashPath = path.resolve(__dirname, '..', '..', '..', 'assets', 'splash.html')
      logger.info(`Serving splash screen from path ${splashPath}`)

      const splash = new BrowserWindow({ width: 800, height: 600, frame: false })
      splash.loadURL(`file://${splashPath}`).catch(reject)

      resolve({
        hide: () => splash.hide(),
        setMessage: async (msg: string) => splash.loadURL(`file://${splashPath}?msg=${encodeURI(msg)}`),
      })
    })
  })
}
