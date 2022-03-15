import { readFileSync, writeFileSync } from 'fs'
import { dump, FAILSAFE_SCHEMA, load } from 'js-yaml'
import { isRecord } from './utility'

function getPath() {
    return 'config.yaml'
}

export function readConfigYaml(): Record<string, unknown> {
    const raw = readFileSync(getPath(), 'utf-8')
    const data = load(raw, {
        schema: FAILSAFE_SCHEMA
    })
    if (isRecord(data)) {
        return data
    }
    throw Error('Expected object after parsing YAML config')
}

export function writeConfigYaml(newValues: Record<string, unknown>): void {
    const data = readConfigYaml()
    for (const [key, value] of Object.entries(newValues)) {
        data[key] = value
    }
    writeFileSync(getPath(), dump(data))
}
