const { readFileSync, existsSync } = require('fs')
const { load } = require('js-yaml')
const { readConfigYaml } = require('./config-yaml')

function getStatus() {
    const statusObject = {
        status: 0,
        address: null,
        config: null
    }
    if (!existsSync('config.yaml') || !existsSync('data-dir')) {
        return statusObject
    }
    statusObject.config = readConfigYaml()
    const { address } = JSON.parse(readFileSync('data-dir/keys/swarm.key'))
    statusObject.address = address
    if (!statusObject.config['block-hash']) {
        statusObject.status = 1
        return statusObject
    }
    statusObject.status = 2
    return statusObject
}

module.exports = { getStatus }
