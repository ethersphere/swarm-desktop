const path = require('path')
const fs = require('fs')

// Taken over from https://github.com/electron/fiddle/blob/main/forge.config.js

if (process.env['WINDOWS_CODESIGN_FILE']) {
  const certPath = path.join(__dirname, 'win-certificate.pfx')
  const certExists = fs.existsSync(certPath)

  if (certExists) {
    process.env['WINDOWS_CODESIGN_FILE'] = certPath
  }
}

const config = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'assets', 'icon.icns'),
    executableName: 'swarm-desktop',
    name: 'Swarm Desktop',
    appBundleId: 'org.ethswarm.swarmDesktop',
    win32metadata: {
      CompanyName: 'Swarm Foundation',
      OriginalFilename: 'Swarm Desktop',
    },
    osxSign: {
      identity: 'Developer ID Application: ', // TODO: Add here
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: 'assets/entitlements.plist',
      'entitlements-inherit': 'assets/entitlements.plist',
      'signature-flags': 'library',
    },
  },
  electronInstallerDebian: {
    bin: 'Swarm Desktop',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'swarm_desktop',
        certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
        certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ethersphere',
          name: 'bee-desktop',
        },
        prerelease: true,
        draft: false,
      },
    },
  ],
}

function notarizeMaybe() {
  if (process.platform !== 'darwin') {
    return
  }

  if (!process.env.CI) {
    console.log(`Not in CI, skipping notarization`)
    return
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn('Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!')
    return
  }

  config.packagerConfig.osxNotarize = {
    appBundleId: 'org.ethswarm.swarmDesktop',
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    ascProvider: '', // TODO: Add here
  }
}

notarizeMaybe()

module.exports = config
