import { ReactElement } from 'react';
import { EnrichedPostageBatch } from '../../providers/Stamps';
interface Props {
    stamps: EnrichedPostageBatch[];
    onSelect: (stamp: EnrichedPostageBatch) => void;
    onClose: () => void;
}
export declare function SelectPostageStampModal({ stamps, onSelect, onClose }: Props): ReactElement;
export {};
