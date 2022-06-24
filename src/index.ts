import { openDashboardInBrowser, openInstallerInBrowser } from './browser'
import { runDownloader } from './downloader'
import { runElectronTray } from './electron'
import { runKeepAliveLoop, runLauncher } from './launcher'
import { findFreePort } from './port'
import { runServer } from './server'
import { getStatus } from './status'
import * as Sentry from '@sentry/electron'

import SENTRY from './.sentry.json'
import PACKAGE_JSON from '../package.json'
import { logger } from './logger'
import { readFileSync, writeFileSync } from 'fs-extra'
import { getPath } from './path'

const DESKTOP_VERSION_FILE = 'desktop.version'

function getDesktopVersionFromFile(): string | undefined {
  try {
    const desktopFile = readFileSync(getPath(DESKTOP_VERSION_FILE))

    return desktopFile.toString('utf-8')
  } catch (e) {
    return
  }
}

function writeDesktopVersionFile() {
  writeFileSync(getPath(DESKTOP_VERSION_FILE), PACKAGE_JSON.version)
}

async function main() {
  logger.info(`Bee Desktop version: ${PACKAGE_JSON.version} (${process.env.NODE_ENV ?? 'production'})`)
  const sentryKey = SENTRY.KEY || process.env.SENTRY_KEY

  if (sentryKey) {
    logger.info('Sentry enabled')
    Sentry.init({
      dsn: sentryKey,
      release: PACKAGE_JSON.version,
      // TODO: Once SDK support attachment https://github.com/getsentry/sentry-electron/issues/496
      // beforeSend(event, hint) {
      //   const attachments = []
      //
      //   if (existsSync(getLogPath('bee.log'))) {
      //     attachments.push({ filename: 'bee.log', data: readFileSync(getLogPath('bee.log'), { encoding: 'utf8' }) })
      //   }
      //
      //   if (existsSync(getLogPath('bee-desktop.log'))) {
      //     attachments.push({
      //       filename: 'bee-desktop.log',
      //       data: readFileSync(getLogPath('bee-desktop.log'), { encoding: 'utf8' }),
      //     })
      //   }
      //
      //   return event
      // },
    })
  }

  // check if the assets and the bee binary matches the desktop version
  const desktopFileVersion = getDesktopVersionFromFile()
  const force = desktopFileVersion !== PACKAGE_JSON.version

  logger.info(
    `Desktop version: ${PACKAGE_JSON.version}, desktop file version: ${desktopFileVersion}, downloading assets: ${force}`,
  )

  if (force) {
    await runDownloader(force)
    writeDesktopVersionFile()
  }

  await findFreePort()
  runServer()
  runElectronTray()

  if (getStatus().hasInitialTransaction) {
    runLauncher()
    openDashboardInBrowser()
  } else {
    openInstallerInBrowser()
  }
  runKeepAliveLoop()
}

main()
