import { app } from 'electron'
import { join, resolve } from 'path'

export function resolvePath(path: string) {
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
