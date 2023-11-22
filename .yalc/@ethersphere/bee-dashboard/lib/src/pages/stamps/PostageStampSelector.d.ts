import { ReactElement } from 'react';
import { EnrichedPostageBatch } from '../../providers/Stamps';
interface Props {
    onSelect: (stamp: EnrichedPostageBatch) => void;
    defaultValue?: string;
}
export declare function PostageStampSelector({ onSelect, defaultValue }: Props): ReactElement;
export {};
