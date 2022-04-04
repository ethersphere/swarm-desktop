const { readFileSync, existsSync } = require('fs')
const { readConfigYaml } = require('./config-yaml')
const { resolvePath } = require('./path')

function getStatus() {
    const statusObject = {
        status: 0,
        address: null,
        config: null
    }
    if (!existsSync(resolvePath('config.yaml')) || !existsSync(resolvePath('data-dir'))) {
        return statusObject
    }
    statusObject.config = readConfigYaml()
    const { address } = JSON.parse(readFileSync(resolvePath('data-dir/keys/swarm.key')))
    statusObject.address = address
    if (!statusObject.config['block-hash']) {
        statusObject.status = 1
        return statusObject
    }
    statusObject.status = 2
    return statusObject
}

module.exports = { getStatus }
