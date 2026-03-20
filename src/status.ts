import { readFileSync } from 'fs'
import { join } from 'path'

import { configFile, dataDirFilePath, readConfigYaml } from './config'
import { isBeeAssetReady } from './downloader'
import { checkPath, getPath } from './path'

interface Status {
  address?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>
  assetsReady: boolean
}

export function getStatus() {
  const status: Status = {
    assetsReady: isBeeAssetReady(),
  }

  if (!checkPath(configFile) || !checkPath(dataDirFilePath)) {
    return status
  }

  status.config = readConfigYaml()
  status.address = readEthereumAddress()

  return status
}

function readEthereumAddress() {
  const path = getPath(join(dataDirFilePath, 'keys', 'swarm.key'))
  const swarmKeyFile = readFileSync(path, 'utf-8')
  const v3 = JSON.parse(swarmKeyFile)

  return v3.address
}
