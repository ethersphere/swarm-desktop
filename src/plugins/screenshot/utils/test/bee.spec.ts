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
    mockBeeInstance = new Bee(BEE_NODE_URL) as jest.Mocked<Bee>
    ;(getBeeInstance as jest.Mock) = jest.fn(() => mockBeeInstance)
  })

  describe('nodeIsConnected', () => {
    it('should return true when node is connected', async () => {
      mockBeeInstance.isConnected.mockResolvedValue(true)

      const res = await nodeIsConnected()

      expect(res).toBe(true)
      expect(mockBeeInstance.isConnected).toHaveBeenCalled()
    })

    it('should throw an error when there is an issue checking connection', async () => {
      mockBeeInstance.isConnected.mockRejectedValue(new Error('Connection failed'))

      await expect(nodeIsConnected()).rejects.toThrow('Connection failed')
    })
  })
})
