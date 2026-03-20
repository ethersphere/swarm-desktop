import net from 'net'

import { DEFAULT_ELECTRON_API_PORT, MAX_ELECTRON_API_PORT } from './config'
import { logger } from './logger'

export const port = {
  value: -1,
}

export async function findFreePort() {
  logger.info('Finding free port...')
  for (let i = DEFAULT_ELECTRON_API_PORT; i < MAX_ELECTRON_API_PORT; i++) {
    const free = await testPort(i)

    if (free) {
      port.value = i
      logger.info(`Found free port: ${i}`)

      return
    }
  }
}

async function testPort(port: number) {
  return new Promise(resolve => {
    const server = net.createServer()
    server.once('error', () => {
      server.close()
      resolve(false)
    })
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port)
  })
}
