const path = require('path')

// Taken over from https://github.com/electron/fiddle/blob/main/forge.config.js

const iconPath = path.resolve(__dirname, 'assets', 'icon.icns')

const config = {
  packagerConfig: {
    icon: iconPath,
    executableName: 'swarm-desktop',
    name: 'Swarm Desktop',
    appBundleId: 'org.ethswarm.swarmDesktop',
    win32metadata: {
      CompanyName: 'Swarm Foundation',
      OriginalFilename: 'Swarm Desktop',
    },
    osxSign: {
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: 'assets/entitlements.plist',
      'entitlements-inherit': 'assets/entitlements.plist',
    },
  },
  electronInstallerDebian: {
    bin: 'Swarm Desktop',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'swarm-desktop',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: iconPath,
      },
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
          name: 'swarm-desktop',
        },
        prerelease: true,
        draft: false,
      },
    },
  ],
}

module.exports = config
