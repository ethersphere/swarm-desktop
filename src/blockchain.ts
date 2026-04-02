import { Contract, JsonRpcPayload, JsonRpcProvider, JsonRpcResult, Wallet } from 'ethers'

import { bzzContractInterface } from './contract'
import { BZZ_ON_XDAI_CONTRACT } from './swap'

const GNOSIS_CHAIN_ID = 100

class FixedIdJsonRpcProvider extends JsonRpcProvider {
  async _send(payload: JsonRpcPayload | Array<JsonRpcPayload>): Promise<Array<JsonRpcResult>> {
    const results = await super._send(payload)
    const payloads = Array.isArray(payload) ? payload : [payload]

    return results.map((result, i) => ({ ...result, id: payloads[i]?.id ?? result.id }))
  }
}

export function newGnosisProvider(url: string): JsonRpcProvider {
  return new FixedIdJsonRpcProvider(url, GNOSIS_CHAIN_ID, { staticNetwork: true, batchMaxCount: 1 })
}

export async function sendNativeTransaction(
  privateKey: string,
  to: string,
  value: string,
  blockchainRpcEndpoint: string,
) {
  const signer = await makeReadySigner(privateKey, blockchainRpcEndpoint)
  const feeData = await signer.provider.getFeeData()
  const gasPrice = feeData.gasPrice || BigInt(0)
  const transaction = await signer.sendTransaction({ to, value, gasPrice })
  const receipt = await transaction.wait(1)

  if (!receipt) {
    throw new Error('Invalid receipt!')
  }

  return { transaction, receipt }
}

export async function sendBzzTransaction(privateKey: string, to: string, value: string, blockchainRpcEndpoint: string) {
  const signer = await makeReadySigner(privateKey, blockchainRpcEndpoint)
  const feeData = await signer.provider.getFeeData()
  const gasPrice = feeData.gasPrice || BigInt(0)
  const bzz = new Contract(BZZ_ON_XDAI_CONTRACT, bzzContractInterface, signer)
  const transaction = await bzz.transfer(to, value, { gasPrice })
  const receipt = await transaction.wait(1)

  if (!receipt) {
    throw new Error('Invalid receipt!')
  }

  return { transaction, receipt }
}

async function makeReadySigner(privateKey: string, blockchainRpcEndpoint: string) {
  const provider = newGnosisProvider(blockchainRpcEndpoint)
  await provider.getNetwork()
  const signer = new Wallet(privateKey, provider)

  return signer
}
