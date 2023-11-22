import { ReactChild, ReactElement } from 'react';
import { WalletAddress } from '../utils/wallet';
interface ContextInterface {
    balance: WalletAddress | null;
    error: Error | null;
    isLoading: boolean;
    lastUpdate: number | null;
    start: (frequency?: number) => void;
    stop: () => void;
    refresh: () => Promise<void>;
}
export declare const Context: import("react").Context<ContextInterface>;
export declare const Consumer: import("react").Consumer<ContextInterface>;
interface Props {
    children: ReactChild;
}
export declare function Provider({ children }: Props): ReactElement;
export {};
