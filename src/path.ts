import { existsSync } from 'fs'
import { join, sep } from 'path'

export function resolvePath(path: string) {
  const origin = process.execPath
  const parts = origin.split(sep)
  while (parts.length) {
    const currentPath = join(sep, ...parts, path)

    if (existsSync(currentPath)) {
      return currentPath
    }
    parts.pop()
  }
  throw Error(`Path ${path} is not found`)
}
