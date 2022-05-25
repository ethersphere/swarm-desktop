import { openInstallerInBrowser } from './browser'
import { runDownloader, waitForInstallerReadiness } from './downloader'
import { runElectronTray } from './electron'
import { runLauncher } from './launcher'
import { findFreePort } from './port'
import { runServer } from './server'
import { getStatus } from './status'

async function main() {
  runDownloader()
  await Promise.all([waitForInstallerReadiness(), findFreePort()])
  runServer()
  runElectronTray()

  if (getStatus().hasInitialTransaction) {
    runLauncher()
  } else {
    openInstallerInBrowser()
  }
}

main()
