import { Contract, ethers, JsonRpcProvider } from 'ethers'

export const WRAPPED_XDAI_CONTRACT = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'
export const BZZ_ON_XDAI_CONTRACT = '0xdbf3ea6f5bee45c02255b2c26a16f300502f68da'
const HONEYSWAP_CONTRACT = '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77'

const contractInterface = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapExactETHForTokens',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
]

export async function swap(
  privateKey: string,
  xdai: string,
  minimumBzz: string,
  blockchainRpcEndpoint: string,
): Promise<string[]> {
  const provider = new JsonRpcProvider(blockchainRpcEndpoint, 100)
  const signer = new ethers.Wallet(privateKey, provider)
  const gasLimit = 1000000
  const contract = new Contract(HONEYSWAP_CONTRACT, contractInterface, signer)
  const response = await contract.swapExactETHForTokens(
    minimumBzz,
    [WRAPPED_XDAI_CONTRACT, BZZ_ON_XDAI_CONTRACT],
    await signer.getAddress(),
    Date.now(),
    {
      value: xdai,
      gasLimit,
    },
  )

  return response
}
