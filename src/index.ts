import { app, dialog } from 'electron'
import squirrelInstallingExecution from 'electron-squirrel-startup'

import PACKAGE_JSON from '../package.json'

import { runScreenshot } from './plugins/screenshot'
import { ensureApiKey } from './api-key'
import { openDashboardInBrowser } from './browser'
import { getDesktopVersionFromFile, writeDesktopVersionFile } from './config'
import { runDownloader } from './downloader'
import { runElectronTray } from './electron'
import { initializeBee, runKeepAliveLoop, runLauncher } from './launcher'
import { logger } from './logger'
import { runMigrations } from './migration'
import { findFreePort } from './port'
import { runServer } from './server'
import { initSplash, Splash } from './splash'
import { getStatus } from './status'

runMigrations()

if (squirrelInstallingExecution) {
  app.quit()
}

function errorHandler(e: Error | string) {
  if (splash) {
    splash.hide()
  }

  if (typeof e !== 'string') {
    e = e.message
  }

  logger.error(e)
  dialog.showErrorBox('There was an error in Swarm Desktop', e)
}

let splash: Splash | undefined

async function main() {
  logger.info(`Bee Desktop version: ${PACKAGE_JSON.version} (${process.env.NODE_ENV ?? 'production'})`)

  splash = await initSplash()

  // Auto updater, latest version fails during import
  try {
    const updateModule = await import('update-electron-app')
    const updater = updateModule.default || updateModule

    if (typeof updater === 'function') {
      updater({
        logger: {
          log: (message: string) => logger.info(message),
          info: (message: string) => logger.info(message),
          error: (message: string) => logger.error(message),
          warn: (message: string) => logger.warn(message),
        },
      })

      logger.info('Initialized auto-updater.')
    } else {
      logger.warn('Cannot initialize auto-updater.')
    }
  } catch (error) {
    logger.error('Failed to initialize auto-updater:', error)
  }

  // check if the assets and the bee binary matches the desktop version
  const desktopFileVersion = getDesktopVersionFromFile()
  const force = desktopFileVersion !== PACKAGE_JSON.version

  logger.info(
    `Desktop version: ${PACKAGE_JSON.version}, desktop file version: ${desktopFileVersion}, downloading assets: ${force}`,
  )

  if (force) {
    splash.setMessage('Downloading Bee')
    await runDownloader(true)
    writeDesktopVersionFile()
  }

  ensureApiKey()
  await findFreePort()
  runServer()

  if (!getStatus().config) {
    logger.info('No Bee config found, initializing Bee')
    splash.setMessage('Initializing Bee')
    await initializeBee()
  }

  runLauncher().catch(errorHandler)
  runElectronTray()

  if (process.env.NODE_ENV !== 'development') openDashboardInBrowser()
  splash.hide()
  splash = undefined

  runKeepAliveLoop()

  app.whenReady().then(() => {
    runScreenshot()
  })
}

main().catch(errorHandler)
