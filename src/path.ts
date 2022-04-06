import { app } from 'electron'
import { platform } from 'os'
import { join, parse, resolve } from 'path'

export function resolvePath(path: string) {
  if (platform() === 'win32') {
    if (process.execPath.includes('node_modules')) {
      return join(process.execPath.split('node_modules')[0], path)
    }
    const parsedPath = parse(process.execPath)
    return join(parsedPath.dir, path)
  }
  if (process.execPath.includes('node_modules/electron/dist/Electron.app')) {
    return resolve(path)
  }
  const appName = `${app.getName()}.app`
  let execPath = process.execPath

  if (execPath.includes(appName)) {
    execPath = execPath.split(appName)[0]
  }

  return join(execPath, path)
}
