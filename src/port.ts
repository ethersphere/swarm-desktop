import net from 'net'
import { logger } from './logger'

export const port = {
  value: -1,
}

const DEFAULT_PORT = 3054

export async function findFreePort() {
  logger.info('Finding free port...')
  for (let i = DEFAULT_PORT; i < 5000; i++) {
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
