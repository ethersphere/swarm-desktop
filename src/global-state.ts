export const globalState = {
    readyToLaunchTray: false
}

export function initialiseGlobalState() {
    globalState.readyToLaunchTray = require('./api-server').getStatus().status === 2
}

