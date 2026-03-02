import { BatchId, Bee, FileUploadOptions, RedundantUploadOptions } from '@ethersphere/bee-js'

import { BEE_NODE_URL } from '../../../config'

let bee: Bee | null = null

export const getBeeInstance = (): Bee => {
  if (!bee) {
    bee = new Bee(BEE_NODE_URL)
  }

  return bee
}

export const nodeIsConnected = async () => {
  const bee = getBeeInstance()

  if (bee) {
    return await bee.isConnected()
  }
}

export const getPostageBatches = async () => {
  const bee = getBeeInstance()

  if (!bee) {
    throw new Error('Bee instance is not initialized')
  }

  const psBatch = await bee.getPostageBatches()

  return psBatch.filter(ps => ps.usable === true)
}

type HandleFileUploadArgs = {
  batchID: string | BatchId
  imgBuffer: string | Uint8Array | File
  name: string
  options?: FileUploadOptions & RedundantUploadOptions
}
export async function handleFileUpload(args: HandleFileUploadArgs) {
  const bee = getBeeInstance()

  if (!bee) {
    throw new Error('Bee instance is not initialized')
  }

  return await bee.uploadFile(args.batchID, args.imgBuffer, args.name, {
    ...args.options,
    contentType: 'image/png',
  })
}
