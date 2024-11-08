import { BatchId, Bee, FileUploadOptions, UploadRedundancyOptions } from '@ethersphere/bee-js'

export const BEE_DASHBOARD_URL = 'http://localhost:3054/dashboard/?#/account/stamps'
export const BEE_NODE_URL = 'http://127.0.0.1:1633'

const bee = (() => new Bee(BEE_NODE_URL))()

export const nodeIsConnected = async () => {
  try {
    return await bee.isConnected()
  } catch (err) {
    throw err
  }
}

export async function getNodeInfo() {
  try {
    return await bee.getNodeInfo()
  } catch (err) {
    throw err
  }
}

export const getAllPostageBatch = async () => {
  try {
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
    return await bee.uploadFile(args.batchID, args.imgBuffer, args.name, {
      ...args.options,
      contentType: 'image/png',
    })
  } catch (err) {
    throw err
  }
}
