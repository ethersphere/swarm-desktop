import { Bee, BeeDebug } from '@ethersphere/bee-js';
import { providers } from 'ethers';
import { ReactElement, ReactNode } from 'react';
interface ContextInterface {
    apiUrl: string;
    apiDebugUrl: string;
    beeApi: Bee | null;
    beeDebugApi: BeeDebug | null;
    lockedApiSettings: boolean;
    desktopApiKey: string;
    isDesktop: boolean;
    desktopUrl: string;
    rpcProviderUrl: string;
    rpcProvider: providers.JsonRpcProvider | null;
    cors: string | null;
    dataDir: string | null;
    ensResolver: string | null;
    setApiUrl: (url: string) => void;
    setDebugApiUrl: (url: string) => void;
    setAndPersistJsonRpcProvider: (url: string) => void;
    isLoading: boolean;
    error: Error | null;
}
export declare const Context: import("react").Context<ContextInterface>;
export declare const Consumer: import("react").Consumer<ContextInterface>;
interface InitialSettings {
    beeApiUrl?: string;
    beeDebugApiUrl?: string;
    lockedApiSettings?: boolean;
    isDesktop?: boolean;
    desktopUrl?: string;
    defaultRpcUrl?: string;
}
interface Props extends InitialSettings {
    children: ReactNode;
}
export declare function Provider({ children, ...propsSettings }: Props): ReactElement;
export {};
