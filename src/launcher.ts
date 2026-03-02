import { spawn } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { platform } from 'os'
import * as RotatingFileStream from 'rotating-file-stream'
import { v4 } from 'uuid'

import { configFile, dataDirFilePath } from './config'
import { rebuildElectronTray } from './electron'
import { BeeManager } from './lifecycle'
import { BeeLogFile, logger, MaxLogFileNumber, MaxLogFileRotateSize } from './logger'
import { checkPath, getDefaultLogPath, getPath } from './path'

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
use-postage-snapshot: false
skip-postage-snapshot: true
resolver-options: https://cloudflare-eth.com
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
  const subprocess = launchBee(abortController).catch(reason => {
    logger.error(reason)
  })
  BeeManager.signalRunning(abortController, subprocess)
  rebuildElectronTray()
  await subprocess
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

    // Also store the logs to log dir
    const fileStream = RotatingFileStream.createStream(BeeLogFile, {
      size: MaxLogFileRotateSize,
      maxFiles: MaxLogFileNumber,
      path: getDefaultLogPath(),
    })
    fileStream.on('error', err => logger.error(err))

    subprocess.stdout.pipe(fileStream)
    subprocess.stderr.pipe(fileStream)

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
