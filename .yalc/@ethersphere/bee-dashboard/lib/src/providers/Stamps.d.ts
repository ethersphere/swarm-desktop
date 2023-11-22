import { PostageBatch } from '@ethersphere/bee-js';
import { ReactChild, ReactElement } from 'react';
export interface EnrichedPostageBatch extends PostageBatch {
    usage: number;
    usageText: string;
}
interface ContextInterface {
    stamps: EnrichedPostageBatch[] | null;
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
export declare function enrichStamp(postageBatch: PostageBatch): EnrichedPostageBatch;
export declare function Provider({ children }: Props): ReactElement;
export {};
