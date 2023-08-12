import { existsSync, readFileSync, writeFileSync } from 'fs'
import { FAILSAFE_SCHEMA, dump, load } from 'js-yaml'
import PACKAGE_JSON from '../package.json'
import { getPath } from './path'

export const SUPPORTED_LEVELS = ['critical', 'error', 'warn', 'info', 'verbose', 'debug']
export const DEFAULT_LOG_LEVEL = 'info'
const DESKTOP_VERSION_FILE = 'desktop.version'

export const logLevel =
  process.env.LOG_LEVEL && SUPPORTED_LEVELS.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : DEFAULT_LOG_LEVEL

export function configYamlExists(): boolean {
  return existsSync(getPath('config.yaml'))
}

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

export function deleteKeyFromConfigYaml(key: string) {
  const data = readConfigYaml()
  delete data[key]
  writeFileSync(getPath('config.yaml'), dump(data))
}

export function getDesktopVersionFromFile(): string | undefined {
  try {
    const desktopFile = readFileSync(getPath(DESKTOP_VERSION_FILE))

    return desktopFile.toString('utf-8')
  } catch (e) {
    return
  }
}

export function writeDesktopVersionFile() {
  writeFileSync(getPath(DESKTOP_VERSION_FILE), PACKAGE_JSON.version)
}

export function readWalletPasswordOrThrow(): string {
  if (!configYamlExists()) {
    throw Error('Attempted to read password, but config.yaml is not found')
  }
  const config = readConfigYaml()

  if (!config.password) {
    throw Error('Attempted to read password, but config.yaml does not contain it')
  }

  return config.password as string
}
