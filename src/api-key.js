const { existsSync, writeFileSync, readFileSync } = require('fs')
const { v4 } = require('uuid')
const { resolvePath } = require('./path')

function getApiKey() {
    if (!existsSync(resolvePath('api-key.txt'))) {
        const apiKey = v4()
        writeFileSync(resolvePath('api-key.txt'), apiKey)
        return apiKey
    }
    return readFileSync(resolvePath('api-key.txt'), 'utf-8')
}

module.exports = { getApiKey }
