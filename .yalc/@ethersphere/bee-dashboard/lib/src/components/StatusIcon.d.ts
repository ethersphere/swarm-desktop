import type { ReactElement } from 'react';
import { CheckState } from '../providers/Bee';
interface Props {
    checkState: CheckState;
    isLoading?: boolean;
    size?: number | string;
    className?: string;
}
export default function StatusIcon({ checkState, size, className, isLoading }: Props): ReactElement;
export {};
