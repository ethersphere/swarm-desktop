const globalState = {
    readyToLaunchTray: false
}

function main() {
    globalState.readyToLaunchTray = require('./api-server').getStatus().status === 2
}

module.exports = { globalState, initialiseGlobalState: main }
