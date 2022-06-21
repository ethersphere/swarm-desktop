# Bee Desktop

## Downloading the corresponding version

Go to the [releases page](https://github.com/ethersphere/bee-desktop/releases/tag/v0.4.0)

Windows: `bee-desktop-0.4.0.Setup.exe`

Mac OS: `bee-desktop-darwin-x64-0.4.0.zip`

Linux: `bee-desktop-0.4.0-1.x86_64.rpm` or `bee-desktop_0.4.0_amd64.deb`

> You can alternatively clone this repository and run `npm install` and then `npm start`

**Until 1.0 release, all our developer releases has enabled error tracking and reporting using [sentry.io](https://sentry.io/)!**

After the 1.0 release this will be changed to opt-in instead.

## Logs

If you run the build version you can access logs of Bee Desktop at:

 - macOS: `~/Library/Logs/Swarm Desktop/bee-desktop.log`
 - Windows: `%LOCALAPPDATA%\Swarm Desktop\Log\bee-desktop.log` (for example, `C:\Users\USERNAME\AppData\Local\Swarm Desktop\Log\bee-desktop.log`)
 - Linux: `~/.local/state/Swarm Desktop/bee-desktop.log`

## If you have a previous installation

You need to delete the previous assets first to receive updates

To do so, delete the `static` folder under the following location:

Windows: `%LOCALAPPDATA%\Swarm Desktop\Data` (for example,
`C:\Users\USERNAME\AppData\Local\Swarm Desktop\Data`)

Mac OS: `~/Library/Application Support/Swarm Desktop`

Linux: `~/.local/share/Swarm Desktop` (or `$XDG_DATA_HOME/Swarm Desktop`)

## Allow running on Mac OS

Mac OS may not allow you to run the `.app` after unzipping. To solve this, right click the `.app` and click Open. You
will have an option to ignore the warning.
