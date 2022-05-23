import { readFileSync } from 'fs'
import { join } from 'path'
import { readConfigYaml } from './config-yaml'
import { isBeeAssetReady } from './downloader'
import { checkPath, getPath } from './path'

interface Status {
  address: string | null
  config: Record<string, any>
  hasInitialTransaction: boolean
  assetsReady: boolean
}

export function getStatus() {
  const status: Status = {
    address: null,
    config: null,
    hasInitialTransaction: false,
    assetsReady: isBeeAssetReady(),
  }

  if (!checkPath('config.yaml') || !checkPath('data-dir')) {
    return status
  }

  status.config = readConfigYaml()
  status.address = readEthereumAddress()

  if (status.config['block-hash'] && status.config.transaction) {
    status.hasInitialTransaction = true
  }

  return status
}

function readEthereumAddress() {
  const path = getPath(join('data-dir', 'keys', 'swarm.key'))
  const swarmKeyFile = readFileSync(path, 'utf-8')
  const v3 = JSON.parse(swarmKeyFile)

  return v3.address
}
