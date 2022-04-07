const { existsSync, writeFileSync } = require('fs')
const { copySync } = require('fs-extra')
const { join } = require('path')
const { platform } = require('os')
const { default: fetch } = require('node-fetch')
const { execSync } = require('child_process')

const binaries = {
  darwin: ['https://github.com/ethersphere/bee/releases/download/v1.5.1-rc1/bee-darwin-amd64', 'bee'],
  linux: ['https://github.com/ethersphere/bee/releases/download/v1.5.1-rc1/bee-linux-amd64', 'bee'],
  win32: ['https://github.com/ethersphere/bee/releases/download/v1.5.1-rc1/bee-windows-amd64.exe', 'bee.exe'],
}

module.exports = {
  generateAssets: async () => {
    const target = binaries[platform()]
    if (!existsSync(target[1])) {
      await downloadFile(target[0], target[1])
      try {
        execSync(`chmod +x ${target[1]}`)
      } catch {}
    }
  },
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

function downloadFile(url, target) {
  return fetch(url)
    .then(x => x.arrayBuffer())
    .then(x => writeFileSync(target, Buffer.from(x)))
}
