import { openInstallerInBrowser } from './browser'
import { runDownloader, waitForInstallerReadiness } from './downloader'
import { runElectronTray } from './electron'
import { runKeepAliveLoop, runLauncher } from './launcher'
import { findFreePort } from './port'
import { runServer } from './server'
import { getStatus } from './status'
import * as Sentry from '@sentry/electron'

import SENTRY from './.sentry.json'
import PACKAGE_JSON from '../package.json'
import { logger } from './logger'

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

  runDownloader()
  await Promise.all([waitForInstallerReadiness(), findFreePort()])
  runServer()
  runElectronTray()

  if (getStatus().hasInitialTransaction) {
    runLauncher()
  } else {
    openInstallerInBrowser()
  }
  runKeepAliveLoop()
}

main()
