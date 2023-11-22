import { ChainState, ChequebookAddressResponse, Health, LastChequesResponse, NodeAddresses, NodeInfo, Peer, Topology } from '@ethersphere/bee-js';
import { ReactChild, ReactElement } from 'react';
import { BzzToken } from '../models/BzzToken';
import type { Balance, ChequebookBalance, Settlements } from '../types';
export declare enum CheckState {
    CONNECTING = "Connecting",
    OK = "OK",
    WARNING = "Warning",
    ERROR = "Error",
    STARTING = "Starting"
}
interface StatusItem {
    isEnabled: boolean;
    checkState: CheckState;
}
interface Status {
    all: CheckState;
    version: StatusItem;
    blockchainConnection: StatusItem;
    debugApiConnection: StatusItem;
    apiConnection: StatusItem;
    topology: StatusItem;
    chequebook: StatusItem;
}
interface ContextInterface {
    status: Status;
    latestPublishedVersion?: string;
    latestUserVersion?: string;
    latestUserVersionExact?: string;
    isLatestBeeVersion: boolean;
    latestBeeVersionUrl: string;
    error: Error | null;
    apiHealth: boolean;
    debugApiHealth: Health | null;
    debugApiReadiness: boolean;
    nodeAddresses: NodeAddresses | null;
    nodeInfo: NodeInfo | null;
    topology: Topology | null;
    chequebookAddress: ChequebookAddressResponse | null;
    peers: Peer[] | null;
    chequebookBalance: ChequebookBalance | null;
    stake: BzzToken | null;
    peerBalances: Balance[] | null;
    peerCheques: LastChequesResponse | null;
    settlements: Settlements | null;
    chainState: ChainState | null;
    chainId: number | null;
    latestBeeRelease: LatestBeeRelease | null;
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
interface InitialSettings {
    isDesktop?: boolean;
}
interface Props extends InitialSettings {
    children: ReactChild;
}
export declare function Provider({ children, isDesktop }: Props): ReactElement;
export {};
