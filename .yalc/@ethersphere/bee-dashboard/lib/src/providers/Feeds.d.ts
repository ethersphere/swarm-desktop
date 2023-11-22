import { ReactChild, ReactElement } from 'react';
export declare type IdentityType = 'V3' | 'PRIVATE_KEY';
export interface Identity {
    uuid: string;
    name: string;
    feedHash?: string;
    identity: string;
    address: string;
    type: IdentityType;
}
interface ContextInterface {
    identities: Identity[];
    setIdentities: (identities: Identity[]) => void;
}
export declare const Context: import("react").Context<ContextInterface>;
export declare const Consumer: import("react").Consumer<ContextInterface>;
interface Props {
    children: ReactChild;
}
export declare function Provider({ children }: Props): ReactElement;
export {};
