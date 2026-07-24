import { spawn } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { platform } from 'os'
import { v4 } from 'uuid'

import { configFile, dataDirFilePath } from './config'
import { rebuildElectronTray } from './electron'
import { BeeManager } from './lifecycle'
import { beeLogger, forwardLines, logger } from './logger'
import { createNotification } from './notify'
import { checkPath, getPath } from './path'

let startFailureCount = 0
const NOTIFY_EVERY_N_FAILURES = 5 // ~50s between toasts at the 10s keep-alive interval

export function runKeepAliveLoop() {
  setInterval(() => {
    if (!BeeManager.isRunning() && BeeManager.shouldRestart()) {
      runLauncher()
    }
  }, 10000)
}

function getBeeExecutable() {
  if (platform() === 'win32') {
    return 'bee.exe'
  }

  return 'bee'
}

function createConfiguration() {
  return `api-addr: 127.0.0.1:1633
swap-enable: false
mainnet: true
full-node: false
cors-allowed-origins: '*'
resolver-options: https://ethereum-rpc.publicnode.com
data-dir: ${getPath(dataDirFilePath)}
password: ${v4()}
storage-incentives-enable: false`
}

export async function initializeBee() {
  if (!checkPath(configFile)) {
    logger.info(`Creating new Bee ${configFile}`)
    writeFileSync(getPath(configFile), createConfiguration())
  }

  const configPath = getPath(configFile)
  logger.debug(`Executing process: bee init --config=${configPath}`)

  return runProcess(getPath(getBeeExecutable()), ['init', `--config=${configPath}`], new AbortController())
}

export async function runLauncher() {
  const abortController = new AbortController()

  if (!checkPath(dataDirFilePath)) {
    mkdirSync(getPath(dataDirFilePath))
  }

  BeeManager.setUserIntention(true)
  let failed = false
  const subprocess = launchBee(abortController).catch(reason => {
    if (abortController.signal.aborted) {
      return
    }
    failed = true
    startFailureCount++
    logger.error(reason)

    if (startFailureCount === 1 || startFailureCount % NOTIFY_EVERY_N_FAILURES === 0) {
      createNotification('Bee failed to start. Open the Logs menu for details.')
    }
  })
  BeeManager.signalRunning(abortController, subprocess)
  rebuildElectronTray()
  const successTimer = setTimeout(() => {
    if (!failed) {
      startFailureCount = 0
    }
  }, 15000)
  await subprocess
  clearTimeout(successTimer)
  logger.info('Bee subprocess finished running')
  abortController.abort()
  BeeManager.signalStopped()
  rebuildElectronTray()
}

async function launchBee(abortController?: AbortController) {
  if (!abortController) {
    abortController = new AbortController()
  }
  const configPath = getPath(configFile)

  logger.debug(`Executing process: bee start --config=${configPath}`)

  return runProcess(getPath(getBeeExecutable()), ['start', `--config=${configPath}`], abortController)
}

async function runProcess(command: string, args: string[], abortController: AbortController): Promise<void> {
  return new Promise((resolve, reject) => {
    const subprocess = spawn(command, args, { signal: abortController.signal, killSignal: 'SIGINT' })

    // Print the logs to console
    subprocess.stdout.pipe(process.stdout)
    subprocess.stderr.pipe(process.stderr)

    forwardLines(subprocess.stdout, line => beeLogger.info(line))
    forwardLines(subprocess.stderr, line => beeLogger.info(line))

    subprocess.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(`process exited with non-zero status code: ${code}`)
      }
    })
    subprocess.on('error', error => {
      reject(error)
    })
  })
}
