import { ReactElement } from 'react';
import { EnrichedPostageBatch } from '../../providers/Stamps';
interface Props {
    stamp: EnrichedPostageBatch;
    shorten?: boolean;
}
export declare function PostageStamp({ stamp, shorten }: Props): ReactElement;
export {};
