const { existsSync } = require('fs')
const { copySync } = require('fs-extra')
const { join } = require('path')

module.exports = {
  postPackage: (_, options) => {
    if (existsSync('bee')) {
      copySync('bee', join(options.outputPaths[0], 'bee'))
    }
    if (existsSync('bee.exe')) {
      copySync('bee.exe', join(options.outputPaths[0], 'bee.exe'))
    }
    copySync('tray.png', join(options.outputPaths[0], 'tray.png'))
    copySync('tray@2x.png', join(options.outputPaths[0], 'tray@2x.png'))
    copySync('icon.png', join(options.outputPaths[0], 'icon.png'))
    copySync('static', join(options.outputPaths[0], 'static'))
  },
}
