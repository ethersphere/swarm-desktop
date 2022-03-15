import { existsSync, readFileSync } from 'fs'
import { readConfigYaml } from './config-yaml'

type BeeDesktopStatus = {
    status: 0 | 1 | 2
    address: string | null
    config: Record<string, unknown> | null
}

export function getStatus(): BeeDesktopStatus {
    const statusObject: BeeDesktopStatus = {
        status: 0,
        address: null,
        config: null
    }
    if (!existsSync('config.yaml') || !existsSync('data-dir')) {
        return statusObject
    }
    statusObject.config = readConfigYaml()
    const { address } = JSON.parse(readFileSync('data-dir/keys/swarm.key', 'utf-8'))
    statusObject.address = address
    if (!statusObject.config['block-hash']) {
        statusObject.status = 1
        return statusObject
    }
    statusObject.status = 2
    return statusObject
}
