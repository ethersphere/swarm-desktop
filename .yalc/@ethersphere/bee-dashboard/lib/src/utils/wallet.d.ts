import { providers, Wallet } from 'ethers';
import { BzzToken } from '../models/BzzToken';
import { DaiToken } from '../models/DaiToken';
export declare class WalletAddress {
    address: string;
    bzz: BzzToken;
    dai: DaiToken;
    provider: providers.JsonRpcProvider;
    private constructor();
    static make(address: string, provider: providers.JsonRpcProvider): Promise<WalletAddress>;
    refresh(): Promise<WalletAddress>;
}
export declare class ResolvedWallet {
    wallet: Wallet;
    bzz: BzzToken;
    dai: DaiToken;
    provider: providers.JsonRpcProvider;
    address: string;
    privateKey: string;
    private constructor();
    static make(privateKeyOrWallet: string | Wallet, provider: providers.JsonRpcProvider): Promise<ResolvedWallet>;
    refresh(): Promise<ResolvedWallet>;
    transfer(destination: string, jsonRpcProvider: string): Promise<void>;
}
