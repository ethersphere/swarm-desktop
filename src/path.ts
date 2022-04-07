import { existsSync } from 'fs'
import { join, parse, sep } from 'path'

export function resolvePath(path: string) {
  return makePath(path)
}

export function makePath(path: string) {
  return join(parse(findAnywhere('tray.png')).dir, path) // FIXME
}

export function canResolvePath(path: string) {
  return existsSync(resolvePath(path))
}

function findAnywhere(path: string) {
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
