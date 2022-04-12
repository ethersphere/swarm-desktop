import { readFileSync, writeFileSync } from 'fs'
import { dump, FAILSAFE_SCHEMA, load } from 'js-yaml'
import { resolvePath } from './path'

function getPath() {
  return resolvePath('config.yaml')
}

export function readConfigYaml() {
  const raw = readFileSync(getPath(), 'utf-8')
  const data = load(raw, {
    schema: FAILSAFE_SCHEMA,
  })

  return data
}

export function writeConfigYaml(newValues: Record<string, any>) {
  const data: Record<string, any> = readConfigYaml()
  for (const [key, value] of Object.entries(newValues)) {
    data[key] = value
  }
  writeFileSync(getPath(), dump(data))
}
