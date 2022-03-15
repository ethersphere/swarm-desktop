const { load, dump } = require('js-yaml')
const { readFileSync, writeFileSync } = require('fs')
const { FAILSAFE_SCHEMA } = require('js-yaml')

function getPath() {
    return 'config.yaml'
}

function readConfigYaml() {
    const raw = readFileSync(getPath(), 'utf-8')
    const data = load(raw, {
        schema: FAILSAFE_SCHEMA
    })
    return data
}

function writeConfigYaml(newValues) {
    const data = readConfigYaml()
    for (const [key, value] of Object.entries(newValues)) {
        data[key] = value
    }
    writeFileSync(getPath(), dump(data))
}

module.exports = {
    readConfigYaml,
    writeConfigYaml
}
