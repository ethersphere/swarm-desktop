import envPaths from 'env-paths'
import { existsSync } from 'fs'
import { join } from 'path'

export const paths = envPaths('Swarm Desktop', { suffix: '' })

export function checkPath(path: string): boolean {
  return existsSync(getPath(path))
}

export function getPath(path: string): string {
  return join(paths.data, path)
}

export function getLogPath(logFileName: string): string {
  return join(paths.log, logFileName)
}

export function getDefaultLogPath(): string {
  return getLogPath('')
}

export function getAssetPath(path: string): string {
  // This file is built into /dist/desktop/src/path.js
  return join(__dirname, '..', '..', '..', 'assets', path)
}
