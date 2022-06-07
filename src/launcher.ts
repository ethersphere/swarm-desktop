import { spawn } from 'child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { platform } from 'os'
import { join } from 'path'
import { rebuildElectronTray } from './electron'
import { BeeManager } from './lifecycle'
import { logger } from './logger'
import { checkPath, getPath } from './path'

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

export async function createConfigFileAndAddress() {
  writeFileSync(getPath('config.yaml'), createStubConfiguration())
  await initializeBee()
}

export async function createInitialTransaction() {
  const config = readFileSync(getPath('config.yaml'), 'utf-8')

  if (!config.includes('block-hash')) {
    const { address } = JSON.parse(readFileSync(getPath('data-dir/keys/swarm.key')).toString())
    logger.info('Sending transaction to address', address)
    const { transaction, blockHash } = await sendTransaction(address)
    writeFileSync(getPath('config.yaml'), createConfiguration(transaction, blockHash))
  }
}

export async function runLauncher() {
  const abortController = new AbortController()

  if (!checkPath('data-dir')) {
    mkdirSync(getPath('data-dir'))
  }

  if (!checkPath('config.yaml')) {
    writeFileSync(getPath('config.yaml'), createStubConfiguration())
  }

  if (!checkPath(join('data-dir', 'keys', 'swarm.key'))) {
    await launchBee().catch()
  }
  const config = readFileSync(getPath('config.yaml'), 'utf-8')

  if (!config.includes('block-hash')) {
    const { address } = JSON.parse(readFileSync(getPath(join('data-dir', 'keys', 'swarm.key'))).toString())
    logger.info('Sending transaction to address', address)
    const { transaction, blockHash } = await sendTransaction(address)
    writeFileSync(getPath('config.yaml'), createConfiguration(transaction, blockHash))
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

async function sendTransaction(address: string) {
  const response = await fetch(`https://onboarding.ethswarm.org/faucet/overlay/${address}`, { method: 'POST' })
  const json = await response.json()

  return { transaction: json.transactionHash, blockHash: json.nextBlockHashBee }
}

function createStubConfiguration() {
  return `api-addr: 127.0.0.1:1633
debug-api-addr: 127.0.0.1:1635
debug-api-enable: true
swap-enable: false
swap-initial-deposit: 1000000000000000
mainnet: true
full-node: false
chain-enable: false
cors-allowed-origins: '*'
use-postage-snapshot: true
resolver-options: https://cloudflare-eth.com
data-dir: ${getPath('data-dir')}`
}

function createConfiguration(transaction: string, blockHash: string) {
  return `${createStubConfiguration()}
transaction: ${transaction}
block-hash: ${blockHash}`
}

async function initializeBee() {
  const configPath = getPath('config.yaml')

  return runProcess(
    getPath(getBeeExecutable()),
    ['init', `--config=${configPath}`, `--password=Test`],
    onStdout,
    onStderr,
    new AbortController(),
  )
}

async function launchBee(abortController?: AbortController) {
  if (!abortController) {
    abortController = new AbortController()
  }
  const configPath = getPath('config.yaml')

  return runProcess(
    getPath(getBeeExecutable()),
    ['start', `--config=${configPath}`, '--password=Test'],
    onStdout,
    onStderr,
    abortController,
  )
}

function onStdout(data: string | Uint8Array) {
  process.stdout.write(data)
}

function onStderr(data: string | Uint8Array) {
  process.stderr.write(data)
}

async function runProcess(
  command: string,
  args: string[],
  onStdout: (chunk: string | Uint8Array) => void,
  onStderr: (chunk: string | Uint8Array) => void,
  abortController: AbortController,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const subprocess = spawn(command, args, { signal: abortController.signal, killSignal: 'SIGINT' })
    subprocess.stdout.on('data', onStdout)
    subprocess.stderr.on('data', onStderr)
    subprocess.on('close', code => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(code)
      }
    })
    subprocess.on('error', error => {
      reject(error)
    })
  })
}
