# Swarm Desktop

[![Tests](https://github.com/ethersphere/swarm-desktop/actions/workflows/tests.yaml/badge.svg)](https://github.com/ethersphere/swarm-desktop/actions/workflows/tests.yaml)
[![](https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square)](https://swarm.ethereum.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/pnpm-%3E=10.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/runs%20on-macOS%20%7C%20Linux%20%7C%20Windows-orange)

> Electron Desktop app that helps you easily spin up and manage Swarm's Bee node

**Warning: This project is in beta state. There might (and most probably will) be changes in the future to its API and
working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

Stay up to date by joining the [official Discord](https://discord.gg/GU22h2utj6) and by keeping an eye on the
[releases tab](https://github.com/ethersphere/swarm-desktop/releases).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
  - [Development](#development)
  - [Test](#test)
- [License](#license)

## Install

Go to the [releases page](https://github.com/ethersphere/swarm-desktop/releases/latest) and download the correct build
for your operation system:

- Windows: `Swarm.Desktop-***.Setup.exe`
- macOS: `Swarm.Desktop-darwin-x64-***.zip`
- Linux: `swarm-desktop_***_amd64.deb` or `swarm-desktop-***-1.x86_64.rpm`

### macOS

macOS may not allow you to run the .app after unzipping. To solve this, right click the .app and click Open. You will
have an option to ignore the warning.

## Usage

TODO

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/ethersphere/swarm-desktop/issues) and take on one of them
- Help our tests reach 100% coverage!
- Join us in our [Discord chat](https://discord.gg/wdghaQsGq5) in the #develop-on-swarm channel if you have questions or
  want to give feedback

### Architecture

Swarm Desktop consists of two components:

1.  Electron back-end that provides orchestration API that retrieve, spins, stops and manage the Bee node
2.  Bundled [Bee Dashboard](https://github.com/ethersphere/bee-dashboard) that provides UI to manage Bee node and
    provides access to Swarm network

The Electron back-end is placed in `src` folder.

The Bee Desktop stores logs of both itself and Bee in the application's logs folder:

- macOS: `~/Library/Logs/Swarm Desktop/`
- Windows: `%LOCALAPPDATA%\Swarm Desktop\Log\` (for example, `C:\Users\USERNAME\AppData\Local\Swarm Desktop\Log\`)
- Linux: `~/.local/state/Swarm Desktop/`

It also stores configuration files, Bee assets and other things in application's data folder:

- Windows: `%LOCALAPPDATA%\Swarm Desktop\Data` (for example, `C:\Users\USERNAME\AppData\Local\Swarm Desktop\Data`)
- Mac OS: `~/Library/Application Support/Swarm Desktop`
- Linux: `~/.local/share/Swarm Desktop` (or `$XDG_DATA_HOME/Swarm Desktop`)

### Development

As there are several independent components it bit depends on what you want to develop.

**Be aware!** The UI won't automatically open during development in order not to confuse on which environment they are
running. You have to open them manually.

#### Electron Desktop

To work on the Electron Desktop back-end you just need to do your work and then run `pnpm start`. This will launch the
Electron app and shows the Tray icon. No UI will be opened automatically. If you need to make more adjustment you have
to exit the process with `SIGINT (CTRL+C)` and relaunch.

#### UI (Dashboard)

To work on the Dashboard, run first `pnpm start` that will spin up the Electron Desktop back-end. Then go to your
locally cloned `bee-dashboard` repo and in it start the development server with `pnpm start`. Dashboard also needs to
have API key injected in order to use the Desktop's API. You can inject it by running `pnpm run desktop` in the
Dashboard repo that will open the Dashboard UI with API key in the URL. Changes are automatically hot-reloaded.

The UI served by the Desktop itself is updated only when you update the `@ethersphere/bee-dashboard` NPM package in the
Desktop repo.

#### Maintenance tasks

There are several handy scripts:

- `pnpm run init:husky` that initializes husky for commit linting
- `pnpm run purge:data` that purge's the Desktop's data folder
- `pnpm run purge:logs` that purge's the Desktop's logs folder

## Maintainers

- [Cafe137](https://github.com/Cafe137)
- [vojtechsimetka](https://github.com/vojtechsimetka)

See what "Maintainer" means [here](https://github.com/ethersphere/repo-maintainer).

## License

[BSD-3-Clause](./LICENSE)
