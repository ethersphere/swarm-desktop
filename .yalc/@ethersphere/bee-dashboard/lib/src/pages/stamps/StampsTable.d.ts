import { ReactElement } from 'react';
import { EnrichedPostageBatch } from '../../providers/Stamps';
interface Props {
    postageStamps: EnrichedPostageBatch[] | null;
}
declare function StampsTable({ postageStamps }: Props): ReactElement | null;
export default StampsTable;
