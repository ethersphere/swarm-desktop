import { readFileSync } from 'fs'
import { join } from 'path'
import { isBeeAssetReady } from './downloader'
import { checkPath, getPath } from './path'
import { readConfigYaml } from './config'

interface Status {
  address?: string
  config?: Record<string, any>
  assetsReady: boolean
}

export function getStatus() {
  const status: Status = {
    assetsReady: isBeeAssetReady(),
  }

  if (!checkPath('config.yaml') || !checkPath('data-dir')) {
    return status
  }

  status.config = readConfigYaml()
  status.address = readEthereumAddress()

  return status
}

function readEthereumAddress() {
  const path = getPath(join('data-dir', 'keys', 'swarm.key'))
  const swarmKeyFile = readFileSync(path, 'utf-8')
  const v3 = JSON.parse(swarmKeyFile)

  return v3.address
}
