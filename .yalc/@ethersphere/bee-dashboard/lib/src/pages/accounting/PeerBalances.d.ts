import type { ReactElement } from 'react';
import { Accounting } from '../../hooks/accounting';
import type { Token } from '../../models/Token';
interface Props {
    isLoadingUncashed: boolean;
    totalUncashed: Token;
    accounting: Accounting[] | null;
}
export default function PeerBalances({ accounting, isLoadingUncashed, totalUncashed }: Props): ReactElement | null;
export {};
