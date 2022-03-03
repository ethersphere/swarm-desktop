const fetch = require('node-fetch')
const { existsSync, readFileSync, writeFileSync, mkdirSync } = require('fs')
const { exit } = require('process')
const { resolve } = require('path')
const { spawn } = require('child_process')

async function main() {
    if (!existsSync('bee')) {
        console.error(`Please compile bee and place it as follows: ${resolve('bee')}`)
        exit(1)
    }
    if (!existsSync('data-dir')) {
        mkdirSync('data-dir')
    }
    if (!existsSync('config.yaml')) {
        writeFileSync('config.yaml', createStubConfiguration())
    }
    if (!existsSync('data-dir/keys/swarm.key')) {
        await launchBee().catch(() => {})
    }
    const config = readFileSync('config.yaml', 'utf-8')
    if (!config.includes('block-hash')) {
        const { address } = JSON.parse(readFileSync('data-dir/keys/swarm.key'))
        console.log('Sending transaction to address', address)
        const { transaction, blockHash } = await sendTransaction(address)
        writeFileSync('config.yaml', createConfiguration(transaction, blockHash))
    }
    launchBee()
}

async function sendTransaction(address) {
    const response = await fetch(`http://getxdai.co/${address}/0`, { method: 'POST' })
    const json = await response.json()
    return { transaction: json.transactionHash, blockHash: json.nextBlockHashBee }
}

function createStubConfiguration() {
    return `api-addr: 127.0.0.1:1633
debug-api-addr: 127.0.0.1:1635
debug-api-enable: true
password: Test
swap-enable: false
swap-initial-deposit: 0
mainnet: true
full-node: false
chain-enable: false
data-dir: ${resolve('data-dir')}`
}

function createConfiguration(transaction, blockHash) {
    return `${createStubConfiguration()}
transaction: ${transaction}
block-hash: ${blockHash}`
}

async function launchBee() {
    const configPath = resolve('config.yaml')
    return runProcess(resolve('bee'), ['start', `--config=${configPath}`], onStdout, onStderr)
}

function onStdout(data) {
    process.stdout.write(data)
}

function onStderr(data) {
    process.stderr.write(data)
}

async function runProcess(command, args, onStdout, onStderr) {
    return new Promise((resolve, reject) => {
        const subprocess = spawn(command, args)
        subprocess.stdout.on('data', onStdout)
        subprocess.stderr.on('data', onStderr)
        subprocess.on('close', code => {
            if (code === 0) {
                resolve(code)
            } else {
                reject(code)
            }
        })
    })
}

main()
