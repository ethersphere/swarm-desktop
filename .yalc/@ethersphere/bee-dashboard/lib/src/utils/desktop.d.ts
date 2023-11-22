import { Token } from '../models/Token';
export interface BeeConfig {
    'api-addr': string;
    'debug-api-addr': string;
    'debug-api-enable': boolean;
    password: string;
    'swap-enable': boolean;
    'swap-initial-deposit': bigint;
    mainnet: boolean;
    'full-node': boolean;
    'cors-allowed-origins': string;
    'resolver-options': string;
    'use-postage-snapshot': boolean;
    'data-dir': string;
    'blockchain-rpc-endpoint'?: string;
}
export declare function getBzzPriceAsDai(desktopUrl: string): Promise<Token>;
export declare function upgradeToLightNode(desktopUrl: string, rpcProvider: string): Promise<BeeConfig>;
export declare function setJsonRpcInDesktop(desktopUrl: string, value: string): Promise<void>;
export declare function getDesktopConfiguration(desktopUrl: string): Promise<BeeConfig>;
export declare function switchNetwork(desktopUrl: string, chain: string): Promise<void>;
export declare function restartBeeNode(desktopUrl: string): Promise<void>;
export declare function createGiftWallet(desktopUrl: string, address: string): Promise<void>;
export declare function performSwap(desktopUrl: string, daiAmount: string): Promise<void>;
export declare function getLatestBeeDesktopVersion(): Promise<string>;
