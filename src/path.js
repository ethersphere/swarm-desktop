const { join } = require('path')
const { app } = require('electron')

function resolvePath(path) {
    if (process.execPath.includes('node_modules/electron/dist/Electron.app')) {
        return path
    }
    const appName = `${app.getName()}.app`
    let execPath = process.execPath
    if (execPath.includes(appName)) {
        execPath = execPath.split(appName)[0]
    }
    return join(execPath, path)
}

module.exports = {
    resolvePath
}
