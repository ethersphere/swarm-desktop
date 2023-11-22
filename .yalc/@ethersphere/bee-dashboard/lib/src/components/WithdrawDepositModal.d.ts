import { ReactElement, ReactNode } from 'react';
import type { BigNumber } from 'bignumber.js';
interface Props {
    successMessage: string;
    errorMessage: string;
    dialogMessage: string;
    label: string;
    max?: BigNumber;
    min?: BigNumber;
    action: (amount: bigint) => Promise<string>;
    icon?: ReactNode;
}
export default function WithdrawDepositModal({ successMessage, errorMessage, dialogMessage, min, max, label, action, icon, }: Props): ReactElement;
export {};
