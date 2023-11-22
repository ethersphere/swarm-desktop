import { providers, BigNumber as BN } from 'ethers';
declare function getNetworkChainId(url: string): Promise<number>;
declare function eth_getBalance(address: string, provider: providers.JsonRpcProvider): Promise<string>;
declare function eth_getBlockByNumber(provider: providers.JsonRpcProvider): Promise<string>;
declare function eth_getBalanceERC20(address: string, provider: providers.JsonRpcProvider, tokenAddress?: string): Promise<string>;
interface TransferResponse {
    transaction: providers.TransactionResponse;
    receipt: providers.TransactionReceipt;
}
export declare function estimateNativeTransferTransactionCost(privateKey: string, jsonRpcProvider: string): Promise<{
    gasPrice: BN;
    totalCost: BN;
}>;
export declare function sendNativeTransaction(privateKey: string, to: string, value: string, jsonRpcProvider: string, externalGasPrice?: BN): Promise<TransferResponse>;
export declare function sendBzzTransaction(privateKey: string, to: string, value: string, jsonRpcProvider: string): Promise<TransferResponse>;
export declare const Rpc: {
    getNetworkChainId: typeof getNetworkChainId;
    sendNativeTransaction: typeof sendNativeTransaction;
    sendBzzTransaction: typeof sendBzzTransaction;
    _eth_getBalance: typeof eth_getBalance;
    _eth_getBalanceERC20: typeof eth_getBalanceERC20;
    eth_getBalance: typeof eth_getBalance & import("@material-ui/core/utils/debounce").Cancelable;
    eth_getBalanceERC20: typeof eth_getBalanceERC20 & import("@material-ui/core/utils/debounce").Cancelable;
    eth_getBlockByNumber: typeof eth_getBlockByNumber;
};
export {};
