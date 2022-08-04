import { useEffect, useState } from 'react'
import InstallIcon from 'remixicon-react/InstallLineIcon'
import RestartIcon from 'remixicon-react/RestartLineIcon'
import { Box } from './Box'
import { Center } from './Center'
import { Circle } from './Circle'
import { Container } from './Container'
import { getJson, postJson } from './net'
import { SwarmLogo } from './SwarmLogo'
import './index.css'

const MAX_RETRIES = 100

async function wait<T>(x?: T): Promise<T | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(x), 1000))
}

function getHost() {
  return process.env.REACT_APP_BEE_DESKTOP_URL || `${window.location.protocol}//${window.location.host}`
}

interface Status {
  address: string | null
  config: Record<string, unknown>
  hasInitialTransaction: boolean
  assetsReady: boolean
}

async function getStatus(): Promise<Status> {
  return await getJson<Status>(`${getHost()}/status`)
}

function Installer() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const urlSearchParams = new URLSearchParams(window.location.search)
  const newApiKey = urlSearchParams.get('v')

  if (newApiKey) {
    localStorage.setItem('apiKey', newApiKey)
    window.location.search = ''
  }

  useEffect(() => {
    if (!isLoading) {
      return
    }

    async function waitForBeeAsset(): Promise<void> {
      setMessage('Downloading Bee binary...')
      for (let i = 0; i < 600; i++) {
        const status = await getStatus()

        if (status.assetsReady) {
          return
        }
        await wait()
      }
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
          // eslint-disable-next-line no-console
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
        const { connections } = await getJson<{ connections: number }>(`${getHost()}/peers`)

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
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error)
        setError(error)
      })
  }, [isLoading])

  function onClick() {
    setIsLoading(true)
  }

  function onRetry() {
    window.location.reload()
  }

  let content

  if (error) {
    content = (
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
    )
  } else if (isLoading) {
    content = (
      <Center>
        <Box mb={7}>
          <Circle color="#ededed" size="216px" borderSize="24px" borderColor="#f8f8f8" spinner quarter />
        </Box>
        <Box mb={1}>
          <p className="strong">Installation in progress</p>
        </Box>
        <p className="light">{message}</p>
      </Center>
    )
  } else {
    content = (
      <Center>
        <Box mb={1}>
          <p className="strong">Welcome to Swarm!</p>
        </Box>
        <Box mb={4}>
          <p className="light">
            Thanks for downloading Swarm Desktop. Click the button below to install Swarm and set up your node. This
            shouldn't take more than a minute.
          </p>
        </Box>
        <button onClick={onClick}>
          <InstallIcon size={18} color="#dd7200" /> Install Swarm
        </button>
      </Center>
    )
  }

  return (
    <div className="installer">
      <Container>
        <SwarmLogo />
        {content}
        <div />
      </Container>
    </div>
  )
}

export default Installer
