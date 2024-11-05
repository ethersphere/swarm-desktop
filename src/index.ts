import { app, dialog } from 'electron'
import updater from 'update-electron-app'

import PACKAGE_JSON from '../package.json'
import { ensureApiKey } from './api-key'
import { openDashboardInBrowser } from './browser'
import { getDesktopVersionFromFile, writeDesktopVersionFile } from './config'
import { runDownloader } from './downloader'
import { runElectronTray } from './electron'
import { initializeBee, runKeepAliveLoop, runLauncher } from './launcher'
import { logger } from './logger'
import { findFreePort } from './port'
import { runServer } from './server'
import { getStatus } from './status'

// TODO: Add types definition
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import squirrelInstallingExecution from 'electron-squirrel-startup'
import { runMigrations } from './migration'
import { runScreenshotImpl } from './plugins/screenshot'
import { initSplash, Splash } from './splash'

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

  // Auto updater
  // @ts-ignore: https://github.com/electron/update-electron-app/pull/96
  updater({ logger: { log: (...args) => logger.info(...args) } })

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
    runScreenshotImpl()
  })
}

main().catch(errorHandler)
