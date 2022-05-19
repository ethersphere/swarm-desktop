import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumber, Contract, providers, Wallet } from 'ethers'
import { bzzContractInterface } from './contract'

export async function sendNativeTransaction(
  privateKey: string,
  address: string,
  amount: string,
  providerHost: string,
): Promise<providers.TransactionResponse> {
  const provider = new JsonRpcProvider(providerHost, 100)
  await provider.ready
  const signer = new Wallet(privateKey, provider)
  const gasPrice = await signer.getGasPrice()

  return signer.sendTransaction({
    to: address,
    value: amount,
    gasPrice,
  })
}

export async function sendBzzTransaction(
  privateKey: string,
  address: string,
  amount: string,
  providerHost: string,
): Promise<providers.TransactionResponse> {
  const provider = new JsonRpcProvider(providerHost, 100)
  await provider.ready
  const signer = new Wallet(privateKey, provider)
  const bzz = new Contract('0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da', bzzContractInterface, signer)
  const gasPrice = await signer.getGasPrice()

  return bzz.transfer(address, BigNumber.from(amount), { gasPrice })
}
