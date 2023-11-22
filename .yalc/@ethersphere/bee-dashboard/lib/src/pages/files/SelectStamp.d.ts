import { ReactElement } from 'react';
import { EnrichedPostageBatch } from '../../providers/Stamps';
interface Props {
    stamps: EnrichedPostageBatch[] | null;
    selectedStamp: EnrichedPostageBatch | null;
    setSelected: (stamp: EnrichedPostageBatch) => void;
}
export default function SimpleMenu({ stamps, selectedStamp, setSelected }: Props): ReactElement | null;
export {};
