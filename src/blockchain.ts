import { Contract, JsonRpcProvider, Wallet } from 'ethers'

import { bzzContractInterface } from './contract'
import { BZZ_ON_XDAI_CONTRACT } from './swap'

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
  const provider = new JsonRpcProvider(blockchainRpcEndpoint, 100)
  await provider.getNetwork()
  const signer = new Wallet(privateKey, provider)

  return signer
}
