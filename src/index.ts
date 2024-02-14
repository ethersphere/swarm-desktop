import PACKAGE_JSON from '../package.json'
import { ensureApiKey } from './api-key'
import { getDesktopVersionFromFile, writeDesktopVersionFile } from './config'
import { runDownloader } from './downloader'
import { initializeBee, runKeepAliveLoop, runLauncher } from './launcher'
import { logger } from './logger'
import { runMigrations } from './migration'
import { findFreePort } from './port'
import { runServer } from './server'
import { Splash } from './splash'
import { getStatus } from './status'

runMigrations()

function errorHandler(e: Error | string) {
  if (splash) {
    splash.hide()
  }

  if (typeof e !== 'string') {
    e = e.message
  }

  logger.error(e)
}

let splash: Splash | undefined

async function main() {
  logger.info(`Bee Desktop version: ${PACKAGE_JSON.version} (${process.env.NODE_ENV ?? 'production'})`)

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

  runKeepAliveLoop()
}

main().catch(errorHandler)
