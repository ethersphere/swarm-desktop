import { existsSync } from 'fs'
import { platform } from 'os'
import { join, parse, sep } from 'path'

export function resolvePath(path: string) {
  return join(parse(findAnywhere('tray.png')).dir, path)
}

export function canResolvePath(path: string) {
  return existsSync(resolvePath(path))
}

function findAnywhere(path: string) {
  const origin = process.execPath
  const parts = origin.split(/\\|\//g)
  while (parts.length) {
    const currentPath = join(platform() === 'win32' ? '' : sep, ...parts, path)

    if (existsSync(currentPath)) {
      return currentPath
    }
    parts.pop()
  }
  throw Error(`Path ${path} is not found`)
}
