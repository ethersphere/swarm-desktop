import { readFileSync, existsSync } from 'fs'
import { readConfigYaml } from './config-yaml'
import { resolvePath } from './path'

interface Status {
  status: 0 | 1 | 2
  address: string | null
  config: Record<string, any>
}

export function getStatus() {
  const statusObject: Status = {
    status: 0,
    address: null,
    config: null,
  }

  if (!existsSync(resolvePath('config.yaml')) || !existsSync(resolvePath('data-dir'))) {
    return statusObject
  }
  statusObject.config = readConfigYaml()
  const { address } = JSON.parse(readFileSync(resolvePath('data-dir/keys/swarm.key')).toString())
  statusObject.address = address

  if (!statusObject.config['block-hash']) {
    statusObject.status = 1

    return statusObject
  }
  statusObject.status = 2

  return statusObject
}
