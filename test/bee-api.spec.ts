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
        connectivity: { isConnected: vi.fn() },
        stamp: { getAll: vi.fn() },
        file: { upload: vi.fn() },
      }
    }),
  }
})

type MockedBee = {
  connectivity: Mocked<Bee['connectivity']>
  stamp: Mocked<Bee['stamp']>
  file: Mocked<Bee['file']>
}

describe('Bee utility functions', () => {
  let mockBeeInstance: MockedBee

  beforeEach(() => {
    mockBeeInstance = getBeeInstance() as unknown as MockedBee
    mockBeeInstance.connectivity.isConnected.mockReset()
    mockBeeInstance.stamp.getAll.mockReset()
    mockBeeInstance.file.upload.mockReset()
  })

  describe('nodeIsConnected', () => {
    it('should return true when node is connected', async () => {
      mockBeeInstance.connectivity.isConnected.mockResolvedValue(true)

      const res = await nodeIsConnected()

      expect(res).toBe(true)
      expect(mockBeeInstance.connectivity.isConnected).toHaveBeenCalled()
    })

    it('should throw an error when there is an issue checking connection', async () => {
      mockBeeInstance.connectivity.isConnected.mockRejectedValue(new Error('Connection failed'))

      await expect(nodeIsConnected()).rejects.toThrow('Connection failed')
    })
  })

  describe('getPostageBatches', () => {
    it('should return only usable postage batches', async () => {
      mockBeeInstance.stamp.getAll.mockResolvedValue([
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
      expect(mockBeeInstance.stamp.getAll).toHaveBeenCalled()
    })

    it('should throw an error if getPostageBatches fails', async () => {
      mockBeeInstance.stamp.getAll.mockRejectedValue(new Error('Failed to fetch batches'))

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

      mockBeeInstance.file.upload.mockResolvedValue(mockResponse)
      const result = await handleFileUpload(args)

      expect(result).toEqual(mockResponse)
      expect(mockBeeInstance.file.upload).toHaveBeenCalledWith(
        args.batchID,
        args.imgBuffer,
        args.name,
        expect.objectContaining({ contentType: 'image/png' }),
      )
    })

    it('should throw an error if uploadFile fails', async () => {
      const errMsg = 'File upload failed.'
      mockBeeInstance.file.upload.mockRejectedValue(new Error(errMsg))

      const args = {
        batchID: 'batch123',
        imgBuffer: new Uint8Array([1, 2, 3]),
        name: 'test-img.png',
      }

      await expect(handleFileUpload(args)).rejects.toThrow(errMsg)

      expect(mockBeeInstance.file.upload).toHaveBeenCalledWith(
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
