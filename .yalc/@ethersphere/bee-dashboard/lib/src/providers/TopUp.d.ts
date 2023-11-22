import { Wallet } from 'ethers';
import { ReactElement } from 'react';
interface ContextInterface {
    giftWallets: Wallet[];
    addGiftWallet: (wallet: Wallet) => void;
}
export declare const Context: import("react").Context<ContextInterface>;
export declare const Consumer: import("react").Consumer<ContextInterface>;
interface Props {
    children: ReactElement;
}
export declare function Provider({ children }: Props): ReactElement;
export {};
