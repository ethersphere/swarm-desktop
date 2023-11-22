import { BeeDebug } from '@ethersphere/bee-js';
import { ReactElement, ReactNode } from 'react';
interface Props {
    label: string;
    icon: ReactNode;
    beeDebug: BeeDebug;
    stamp: string;
}
export default function StampExtensionModal({ label, icon, beeDebug, stamp }: Props): ReactElement;
export {};
