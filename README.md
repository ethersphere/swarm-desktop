# Swarm Desktop

[![Tests](https://github.com/ethersphere/swarm-desktop/actions/workflows/tests.yaml/badge.svg)](https://github.com/ethersphere/swarm-desktop/actions/workflows/tests.yaml)
[![](https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square)](https://swarm.ethereum.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/pnpm-%3E=10.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D24.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/runs%20on-macOS%20%7C%20Linux%20%7C%20Windows-orange)

> Electron Desktop app that helps you easily spin up and manage Swarm's Bee node

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

Go to the [releases page](https://github.com/ethersphere/swarm-desktop/releases/latest) and download the correct build for your operating system:

- Windows: `Swarm.Desktop-***.Setup.exe`
- macOS: `Swarm.Desktop-darwin-x64-***.zip`
- Linux: `swarm-desktop_***_amd64.deb` or `swarm-desktop-***-1.x86_64.rpm`

### macOS

macOS may not allow you to run the `.app` after unzipping. To solve this, right-click the `.app` and click Open. You will have an option to ignore the warning.

## Usage

### First launch

On first run a frameless splash screen (`src/splash.ts`) is shown while the Bee binary is downloaded and initialised. Once ready the splash disappears and Swarm Desktop runs silently from the **system tray** — no main window is opened automatically.

### Tray menu

Right-click (or click) the tray icon to access all controls (`src/electron.ts`):

- **Open in Browser** — opens the Bee Dashboard web UI in your default browser
- **Start Bee** / **Stop Bee** — start or stop the managed Bee node
- **Apps** — quick links to community apps (Event Communication Platform, Decentralized Wiki, Decentralized OSM)
- **Swarm Screenshot** — capture and share a screenshot via Swarm
- **Logs** — opens the log folder in your file manager
- **Quit** — stops Bee and exits the application

### Ports

| Service | Default | Range |
|---|---|---|
| Bee Dashboard | `3054` | auto-scans `3054`–`5000` (`src/port.ts`) |
| Bee API | `1633` | fixed (`src/launcher.ts`) |

### Data & logs locations

Logs (Electron + Bee output):

- macOS: `~/Library/Logs/Swarm Desktop/`
- Windows: `%LOCALAPPDATA%\Swarm Desktop\Log\`
- Linux: `~/.local/state/Swarm Desktop/`

Data & configuration (Bee binary, config, wallet):

- macOS: `~/Library/Application Support/Swarm Desktop`
- Windows: `%LOCALAPPDATA%\Swarm Desktop\Data`
- Linux: `~/.local/share/Swarm Desktop`

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/ethersphere/swarm-desktop/issues) and take on one of them
- Help our tests reach 100% coverage!
- Join us in our [Discord chat](https://discord.gg/wdghaQsGq5) in the #develop-on-swarm channel if you have questions or want to give feedback

### Architecture

Swarm Desktop consists of two components:

1.  Electron back-end that provides orchestration API that retrieve, spins, stops and manage the Bee node
2.  Bundled [Bee Dashboard](https://github.com/ethersphere/bee-dashboard) that provides UI to manage Bee node and provides access to Swarm network. It is launched with `isDesktop={true}` and `giftWalletFees` (the xDAI/xBZZ amounts used when creating a gift wallet, defined in `src/gift-wallet-fees.ts` as `GIFT_WALLET_DAI_AMOUNT` and `GIFT_WALLET_BZZ_AMOUNT`).

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

**Be aware!** The UI won't automatically open during development in order not to confuse on which environment they are running. You have to open them manually.

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
- `pnpm run purge:data` that purges the Desktop's data folder
- `pnpm run purge:logs` that purges the Desktop's logs folder

## Maintainers

- [Cafe137](https://github.com/Cafe137)
- [vojtechsimetka](https://github.com/vojtechsimetka)

See what "Maintainer" means [here](https://github.com/ethersphere/repo-maintainer).

## License

[BSD-3-Clause](./LICENSE)
