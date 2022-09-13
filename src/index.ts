import * as Sentry from '@sentry/electron'
import { dialog, app } from 'electron'
import updater from 'update-electron-app'

import {
  configYamlExists,
  getDesktopVersionFromFile,
  readConfigYaml,
  writeConfigYaml,
  writeDesktopVersionFile,
} from './config'
import { openDashboardInBrowser } from './browser'
import { runDownloader } from './downloader'
import { runElectronTray } from './electron'
import { initializeBee, runKeepAliveLoop, runLauncher } from './launcher'
import { findFreePort } from './port'
import { runServer } from './server'
import { getStatus } from './status'
import SENTRY from './.sentry.json'
import PACKAGE_JSON from '../package.json'
import { logger } from './logger'
import { ensureApiKey } from './api-key'

// TODO: Add types definition
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import squirrelInstallingExecution from 'electron-squirrel-startup'
import { initSplash, Splash } from './splash'

// TODO: remove this after 1.0.0 release
// this is a migration path for pioneers
// who helped testing the early versions
if (configYamlExists() && !readConfigYaml().password) writeConfigYaml({ password: 'Test' })

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
}

main().catch(errorHandler)
