import { spawn } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { platform } from 'os'
import { v4 } from 'uuid'
import { rebuildElectronTray } from './electron'
import { BeeManager } from './lifecycle'
import { logger } from './logger'
import { checkPath, getLogPath, getPath } from './path'
import * as FileStreamRotator from 'file-stream-rotator'

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
  // TODO: Revert `full-node: false`
  return `api-addr: 127.0.0.1:1633
debug-api-addr: 127.0.0.1:1635
debug-api-enable: true
swap-enable: false
swap-initial-deposit: 1000000000000000
mainnet: false
bootnode: /dnsaddr/testnet.ethswarm.org
network-id: 10
full-node: false
chain-enable: false
cors-allowed-origins: '*'
use-postage-snapshot: true
resolver-options: https://cloudflare-eth.com
data-dir: ${getPath('data-dir')}
password: ${v4()}`
}

export async function initializeBee() {
  if (!checkPath('config.yaml')) {
    logger.info('Creating new Bee config.yaml')
    writeFileSync(getPath('config.yaml'), createConfiguration())
  }

  const configPath = getPath('config.yaml')
  logger.debug(`Executing process: bee init --config=${configPath}`)

  return runProcess(getPath(getBeeExecutable()), ['init', `--config=${configPath}`], new AbortController())
}

export async function runLauncher() {
  const abortController = new AbortController()

  if (!checkPath('data-dir')) {
    mkdirSync(getPath('data-dir'))
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
  const configPath = getPath('config.yaml')

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
    const fileStream = FileStreamRotator.getStream({
      filename: getLogPath('bee'),
      verbose: false,
      size: '500k',
      max_logs: '10',
      extension: '.log',
      create_symlink: true,
      symlink_name: 'bee.current.log',
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
