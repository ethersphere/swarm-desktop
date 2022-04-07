import { spawn } from 'child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { platform } from 'os'
import { join } from 'path'
import { exit } from 'process'
import { rebuildElectronTray } from './electron'
import { BeeManager } from './lifecycle'
import { logger } from './logger'
import { canResolvePath, makePath, resolvePath } from './path'

function getBeeExecutable() {
  if (platform() === 'win32') {
    return 'bee.exe'
  }

  return 'bee'
}

export async function createConfigFileAndAddress() {
  writeFileSync(makePath('config.yaml'), createStubConfiguration())
  await initializeBee()
}

export async function createInitialTransaction() {
  const config = readFileSync(resolvePath('config.yaml'), 'utf-8')

  if (!config.includes('block-hash')) {
    const { address } = JSON.parse(readFileSync(resolvePath('data-dir/keys/swarm.key')).toString())
    logger.info('Sending transaction to address', address)
    const { transaction, blockHash } = await sendTransaction(address)
    writeFileSync(makePath('config.yaml'), createConfiguration(transaction, blockHash))
  }
}

export async function runLauncher() {
  const abortController = new AbortController()

  if (!canResolvePath(getBeeExecutable())) {
    logger.info(`Please compile bee and place it as follows: ${makePath(getBeeExecutable())}`)
    exit(1)
  }

  if (!canResolvePath('data-dir')) {
    mkdirSync(makePath('data-dir'))
  }

  if (!canResolvePath('config.yaml')) {
    writeFileSync(makePath('config.yaml'), createStubConfiguration())
  }

  if (!canResolvePath(join('data-dir', 'keys', 'swarm.key'))) {
    await launchBee().catch()
  }
  const config = readFileSync(resolvePath('config.yaml'), 'utf-8')

  if (!config.includes('block-hash')) {
    const { address } = JSON.parse(readFileSync(resolvePath(join('data-dir', 'keys', 'swarm.key'))).toString())
    logger.info('Sending transaction to address', address)
    const { transaction, blockHash } = await sendTransaction(address)
    writeFileSync(makePath('config.yaml'), createConfiguration(transaction, blockHash))
  }
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
  const response = await fetch(`http://getxdai.co/${address}/0`, { method: 'POST' })
  const json = await response.json()

  return { transaction: json.transactionHash, blockHash: json.nextBlockHashBee }
}

function createStubConfiguration() {
  return `api-addr: 127.0.0.1:1633
debug-api-addr: 127.0.0.1:1635
debug-api-enable: true
password: Test
swap-enable: false
swap-initial-deposit: 0
mainnet: true
full-node: false
chain-enable: false
cors-allowed-origins: '*'
use-postage-snapshot: true
data-dir: ${makePath('data-dir')}`
}

function createConfiguration(transaction: string, blockHash: string) {
  return `${createStubConfiguration()}
transaction: ${transaction}
block-hash: ${blockHash}`
}

async function initializeBee() {
  const configPath = makePath('config.yaml')

  return runProcess(
    resolvePath(getBeeExecutable()),
    ['init', `--config=${configPath}`],
    onStdout,
    onStderr,
    new AbortController(),
  )
}

async function launchBee(abortController?: AbortController) {
  if (!abortController) {
    abortController = new AbortController()
  }
  const configPath = makePath('config.yaml')

  return runProcess(
    resolvePath(getBeeExecutable()),
    ['start', `--config=${configPath}`],
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
