import { Bee } from '@ethersphere/bee-js'
// eslint-disable-next-line unused-imports/no-unused-imports
import { BEE_NODE_URL, getBeeInstance, nodeIsConnected } from '../bee-api'

jest.mock('@ethersphere/bee-js', () => {
  return {
    Bee: jest.fn().mockImplementation(url => {
      return {
        isConnected: jest.fn(),
      }
    }),
  }
})

describe('Bee utility functions', () => {
  let mockBeeInstance: jest.Mocked<Bee>

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mockBeeInstance = new (require('@ethersphere/bee-js').Bee as jest.Mock)(BEE_NODE_URL) as jest.Mocked<Bee>
    // eslint-disable-next-line prettier/prettier
    (getBeeInstance as jest.Mock) = jest.fn(() => mockBeeInstance)
  })
})
