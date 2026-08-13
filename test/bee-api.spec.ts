import type { Bee } from '@ethersphere/bee-js'
import type { Mocked } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getBeeInstance,
  getPostageBatches,
  handleFileUpload,
  nodeIsConnected,
} from '../src/plugins/screenshot/utils/bee-api'

vi.mock('env-paths', () => ({
  default: vi.fn().mockImplementation(() => ({
    data: 'test/data',
    config: 'test/data',
    cache: 'test/data',
    log: 'test/data',
    temp: 'test/data',
  })),
}))

vi.mock('@ethersphere/bee-js', () => {
  return {
    // eslint-disable-next-line prefer-arrow-callback -- must be a constructible function for `new Bee(...)`
    Bee: vi.fn().mockImplementation(function BeeCtor(_) {
      return {
        isConnected: vi.fn(),
        getPostageBatches: vi.fn(),
        uploadFile: vi.fn(),
      }
    }),
  }
})

describe('Bee utility functions', () => {
  let mockBeeInstance: Mocked<Bee>

  beforeEach(() => {
    mockBeeInstance = getBeeInstance() as Mocked<Bee>
    mockBeeInstance.isConnected.mockReset()
    mockBeeInstance.getPostageBatches.mockReset()
    mockBeeInstance.uploadFile.mockReset()
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
        { batchID: { toHex: () => 'batch1' }, usable: true },
        { batchID: { toHex: () => 'batch2' }, usable: false },
        { batchID: { toHex: () => 'batch3' }, usable: true },
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
