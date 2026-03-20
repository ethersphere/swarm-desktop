import { Bee } from '@ethersphere/bee-js'

import { BEE_NODE_URL } from '../src/config'
import {
  getBeeInstance, // eslint-disable-line @typescript-eslint/no-unused-vars
  getPostageBatches,
  handleFileUpload,
  nodeIsConnected,
} from '../src/plugins/screenshot/utils/bee-api'

jest.mock(
  'env-paths',
  () => () =>
    jest.fn().mockImplementation(() => ({
      data: 'test/data',
      config: 'test/data',
      cache: 'test/data',
      log: 'test/data',
      temp: 'test/data',
    })),
)

jest.mock('@ethersphere/bee-js', () => {
  return {
    Bee: jest.fn().mockImplementation(_ => {
      return {
        isConnected: jest.fn(),
        getPostageBatches: jest.fn(),
        uploadFile: jest.fn(),
      }
    }),
  }
})

describe('Bee utility functions', () => {
  let mockBeeInstance: jest.Mocked<Bee>

  beforeEach(() => {
    mockBeeInstance = new Bee(BEE_NODE_URL) as jest.Mocked<Bee>
    // eslint-disable-next-line no-import-assign
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

  describe('getPostageBatches', () => {
    it('should return only usable postage batches', async () => {
      mockBeeInstance.getPostageBatches.mockResolvedValue([
        { batchID: 'batch1', usable: true },
        { batchID: 'batch2', usable: false },
        { batchID: 'batch3', usable: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any)

      const result = await getPostageBatches()

      expect(result).toEqual([
        { batchID: 'batch1', usable: true },
        { batchID: 'batch3', usable: true },
      ])
      expect(mockBeeInstance.getPostageBatches).toHaveBeenCalled()
    })

    it('should throw an error if getPostageBatches fails', async () => {
      mockBeeInstance.getPostageBatches.mockRejectedValue(new Error('Failed to fetch batches'))

      await expect(getPostageBatches()).rejects.toThrow('Failed to fetch batches')
    })
  })

  describe('handleFileUpload', () => {
    it('should successfully upload a file', async () => {
      const mockResponse = {
        reference: 'Reference',
        tagUid: 12,
        historyAddress: 'string',
        cid: () => 'string',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any

      const args = {
        batchID: 'batch123',
        imgBuffer: new Uint8Array([1, 2, 3]),
        name: 'test-img.png',
      }

      mockBeeInstance.uploadFile.mockResolvedValue(mockResponse)
      const result = await handleFileUpload(args)

      expect(result).toEqual(mockResponse)
      expect(mockBeeInstance.uploadFile).toHaveBeenCalledWith(
        args.batchID,
        args.imgBuffer,
        args.name,
        expect.objectContaining({ contentType: 'image/png' }),
      )
    })

    it('should throw an error if uploadFile fails', async () => {
      const errMsg = 'File upload failed.'
      mockBeeInstance.uploadFile.mockRejectedValue(new Error(errMsg))

      const args = {
        batchID: 'batch123',
        imgBuffer: new Uint8Array([1, 2, 3]),
        name: 'test-img.png',
      }

      await expect(handleFileUpload(args)).rejects.toThrow(errMsg)

      expect(mockBeeInstance.uploadFile).toHaveBeenCalledWith(
        args.batchID,
        args.imgBuffer,
        args.name,
        expect.objectContaining({
          contentType: 'image/png',
        }),
      )
    })
  })
})
