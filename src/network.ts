import { dialog } from 'electron'
import prompt from 'electron-prompt'
import { cpSync, existsSync } from 'fs'
import fetch from 'node-fetch'
import { deleteKeyFromConfigYaml, readConfigYaml, writeConfigYaml } from './config'
import { runLauncher } from './launcher'
import { BeeManager } from './lifecycle'
import { getPath } from './path'

export function getCurrentNetwork(): 'test' | 'main' {
  const config = readConfigYaml()
  if (config.mainnet === true || config.mainnet === 'true') {
    return 'main'
  }
  return 'test'
}

export function initializeMultinetConfig() {
  if (!existsSync(getPath('config.main.yaml'))) {
    cpSync(getPath('config.yaml'), getPath('config.main.yaml'))
  }
  if (!existsSync(getPath('config.test.yaml'))) {
    cpSync(getPath('config.yaml'), getPath('config.test.yaml'))
    writeConfigYaml(
      {
        mainnet: false,
        'swap-enable': false,
        'chequebook-enable': false,
        'data-dir': getPath('data-dir-test'),
      },
      'config.test.yaml',
    )
    deleteKeyFromConfigYaml('blockchain-rpc-endpoint', 'config.test.yaml')
  }
}

export async function toggleNetwork() {
  const currentNetwork = getCurrentNetwork()
  if (currentNetwork === 'main') {
    await switchToTestnet()
  } else {
    await switchToMainnet()
  }
}

export async function switchToTestnet() {
  const testConfig = readConfigYaml('config.test.yaml')
  if (!testConfig['blockchain-rpc-endpoint']) {
    const answer = await prompt({
      title: 'Sepolia JSON RPC endpoint',
      label: 'URL:',
      value: 'http://example.org',
      inputAttrs: {
        type: 'url',
      },
      type: 'input',
    }).catch(console.error)
    if (!answer) {
      dialog.showErrorBox('Error', 'Sepolia JSON RPC endpoint is required')
      return
    }
    const response = await fetch(answer, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 }),
    }).catch(() => {
      dialog.showErrorBox('Error', 'Sepolia JSON RPC endpoint is not reachable')
    })
    if (!response) {
      return
    }
    const data = await response.json().catch(() => {
      dialog.showErrorBox('Error', 'Sepolia JSON RPC endpoint is not returning valid JSON')
    })
    if (!data) {
      return
    }
    writeConfigYaml({ 'blockchain-rpc-endpoint': answer }, 'config.test.yaml')
  }
  BeeManager.stop()
  await BeeManager.waitForSigtermToFinish()
  cpSync(getPath('config.yaml'), getPath('config.main.yaml'))
  cpSync(getPath('config.test.yaml'), getPath('config.yaml'))
  runLauncher()
}

export async function switchToMainnet() {
  BeeManager.stop()
  await BeeManager.waitForSigtermToFinish()
  cpSync(getPath('config.yaml'), getPath('config.test.yaml'))
  cpSync(getPath('config.main.yaml'), getPath('config.yaml'))
  runLauncher()
}
