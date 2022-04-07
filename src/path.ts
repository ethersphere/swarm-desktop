import { existsSync } from 'fs'
import { join, parse, sep } from 'path'

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

export function makePath(path: string) {
  return join(parse(resolvePath('tray.png')).dir, path) // FIXME
}

export function canResolvePath(path: string) {
  try {
    resolvePath(path)

    return true
  } catch {
    return false
  }
}
