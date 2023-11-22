import { Bee, BeeDebug } from '@ethersphere/bee-js';
import { Wallet } from 'ethers';
import { Identity, IdentityType } from '../providers/Feeds';
export declare function generateWallet(): Wallet;
export declare function persistIdentity(identities: Identity[], identity: Identity): void;
export declare function persistIdentitiesWithoutUpdate(identities: Identity[]): void;
export declare function convertWalletToIdentity(identity: Wallet, type: IdentityType, name: string, password?: string): Promise<Identity>;
export declare function importIdentity(name: string, data: string): Promise<Identity | null>;
export declare function updateFeed(beeApi: Bee, beeDebugApi: BeeDebug | null, identity: Identity, hash: string, stamp: string, password?: string): Promise<void>;
