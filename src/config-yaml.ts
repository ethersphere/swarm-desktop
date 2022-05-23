import { readFileSync, writeFileSync } from 'fs'
import { dump, FAILSAFE_SCHEMA, load } from 'js-yaml'
import { getPath } from './path'

export function readConfigYaml(): Record<string, unknown> {
  const raw = readFileSync(getPath('config.yaml'), 'utf-8')
  const data = load(raw, {
    schema: FAILSAFE_SCHEMA,
  })

  return data as Record<string, unknown>
}

export function writeConfigYaml(newValues: Record<string, unknown>) {
  const data = readConfigYaml()
  for (const [key, value] of Object.entries(newValues)) {
    data[key] = value
  }
  writeFileSync(getPath('config.yaml'), dump(data))
}
