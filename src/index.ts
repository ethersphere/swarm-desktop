import { shell } from 'electron'
import { getApiKey } from './api-key'
import { runDownloader, waitForInstallerReadiness } from './downloader'
import { runElectronTray } from './electron'
import { runLauncher } from './launcher'
import { findFreePort, port } from './port'
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
    shell.openExternal(`http://localhost:${port.value}/installer/?v=${getApiKey()}`)
  }
}

main()
