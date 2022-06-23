import { useEffect, useState } from 'react'
import InstallIcon from 'remixicon-react/InstallLineIcon'
import RestartIcon from 'remixicon-react/RestartLineIcon'
import { Box } from './Box'
import { Center } from './Center'
import { Circle } from './Circle'
import { Container } from './Container'
import { getJson, postJson } from './net'
import { SwarmLogo } from './SwarmLogo'

const MAX_RETRIES = 100

function App() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(false)

    const urlSearchParams = new URLSearchParams(window.location.search)
    const newApiKey = urlSearchParams.get('v')
    if (newApiKey) {
        localStorage.setItem('apiKey', newApiKey)
        window.location.search = ''
    }

    async function wait(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), 1000))
    }

    function getHost() {
        return `${window.location.protocol}//${window.location.host}`
    }

    useEffect(() => {
        if (!loading) {
            return
        }

        async function getStatus() {
            const response = await getJson(`${getHost()}/status`)
            return response
        }

        async function waitForBeeAsset() {
            setMessage('Downloading Bee binary...')
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i < 600; i++) {
                    const status = await getStatus()
                    if (status.assetsReady) {
                        resolve()

                        return
                    }
                    await wait()
                }
                reject()
            })
        }

        async function connectToDesktopApi() {
            setMessage('Connecting to Desktop API...')
            const status = await getStatus()
            if (!status.assetsReady) {
                await waitForBeeAsset()
            }
        }

        async function generateAddress() {
            setMessage('Generating Bee Ethereum address...')
            return postJson(`${getHost()}/setup/address`)
        }

        async function createInitialTransaction() {
            setMessage('Creating initial transaction...')
            for (let i = 0; i < 5; i++) {
                try {
                    await postJson(`${getHost()}/setup/transaction`)
                    return
                } catch (error) {
                    console.error(error)
                }
            }
            throw Error('All attempts failed to create initial transaction')
        }

        async function restartBee() {
            setMessage('Starting Bee...')
            return postJson(`${getHost()}/restart`)
        }

        async function waitForUltraLightNode() {
            setMessage('Waiting for ultra light mode...')
            for (let i = 0; i < MAX_RETRIES; i++) {
                const { connections } = await getJson(`${getHost()}/peers`)
                if (connections > 0) {
                    return
                }
                await wait(1000)
            }
            throw Error('Could not start in ultra light mode')
        }

        connectToDesktopApi()
            .then(wait)
            .then(generateAddress)
            .then(wait)
            .then(createInitialTransaction)
            .then(wait)
            .then(restartBee)
            .then(wait)
            .then(waitForUltraLightNode)
            .then(wait)
            .then(() => window.location.replace(`${getHost()}/dashboard/`))
            .catch(error => setError(error))
    }, [loading])

    function onClick() {
        setLoading(true)
    }

    function onRetry() {
        window.location.reload()
    }

    const content = error ? (
        <Center>
            <Box mb={1}>
                <p className="strong">Installation failed!</p>
            </Box>
            <Box mb={4}>
                <p className="light">Sorry… if this happens again you may try to install Swarm manually.</p>
            </Box>
            <button onClick={onRetry}>
                <RestartIcon size={18} color="#dd7200" /> Retry now
            </button>
        </Center>
    ) : loading ? (
        <Center>
            <Box mb={7}>
                <Circle color="#ededed" size="216px" borderSize="24px" borderColor="#f8f8f8" spinner quarter />
            </Box>
            <Box mb={1}>
                <p className="strong">Installation in progress...</p>
            </Box>
            <p className="light">{message}</p>
        </Center>
    ) : (
        <Center>
            <Box mb={1}>
                <p className="strong">Welcome to Swarm!</p>
            </Box>
            <Box mb={4}>
                <p className="light">
                    Thanks for downloading Swarm Desktop. Click the button below to install Swarm and set up your node.
                    This shouldn't take more than 30 seconds.
                </p>
            </Box>
            <button onClick={onClick}>
                <InstallIcon size={18} color="#dd7200" /> Install Swarm
            </button>
        </Center>
    )

    return (
        <Container>
            <SwarmLogo />
            {content}
            <div />
        </Container>
    )
}

export default App
