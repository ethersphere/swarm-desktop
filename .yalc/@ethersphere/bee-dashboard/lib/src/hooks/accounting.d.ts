import { BeeDebug } from '@ethersphere/bee-js';
import { Token } from '../models/Token';
import { Balance, Settlements } from '../types';
interface UseAccountingHook {
    isLoadingUncashed: boolean;
    totalUncashed: Token;
    accounting: Accounting[] | null;
}
export interface Accounting {
    peer: string;
    uncashedAmount: Token;
    balance: Token;
    received: Token;
    sent: Token;
    total: Token;
}
export declare const useAccounting: (beeDebugApi: BeeDebug | null, settlements: Settlements | null, balances: Balance[] | null) => UseAccountingHook;
export {};
