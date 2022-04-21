import envPaths from 'env-paths'
import { existsSync } from 'fs'
import { join } from 'path'

export const paths = envPaths('bee-desktop')

export function checkPath(path: string): boolean {
  return existsSync(getPath(path))
}

export function getPath(path: string): string {
  return join(paths.data, path)
}
