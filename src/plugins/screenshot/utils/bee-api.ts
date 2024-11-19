import { BatchId, Bee, FileUploadOptions, UploadRedundancyOptions } from '@ethersphere/bee-js'

export const BEE_DASHBOARD_URL = 'http://localhost:3054/dashboard/?#/account/stamps'
export const BEE_NODE_URL = 'http://127.0.0.1:1633'

let bee: Bee | null = null

export const getBeeInstance = (): Bee => {
  if (!bee) {
    bee = new Bee(BEE_NODE_URL)
  }

  return bee
}

export const nodeIsConnected = async () => {
  try {
    const bee = getBeeInstance()

    if (bee) {
      return await bee.isConnected()
    }
  } catch (err) {
    throw err
  }
}

export const getAllPostageBatch = async () => {
  try {
    const bee = getBeeInstance()

    if (!bee) {
      throw new Error('Bee instance is not initialized')
    }

    const psBatch = await bee.getAllPostageBatch()

    return psBatch.filter(ps => ps.usable === true)
  } catch (err) {
    throw err
  }
}

type HandleFileUploadArgs = {
  batchID: string | BatchId
  imgBuffer: string | Uint8Array | File
  name: string
  options?: FileUploadOptions & UploadRedundancyOptions
}
export async function handleFileUpload(args: HandleFileUploadArgs) {
  try {
    const bee = getBeeInstance()

    if (!bee) {
      throw new Error('Bee instance is not initialized')
    }

    return await bee.uploadFile(args.batchID, args.imgBuffer, args.name, {
      ...args.options,
      contentType: 'image/png',
    })
  } catch (err) {
    throw err
  }
}
