import { ReactElement } from 'react';
interface Props {
    active: 'WALLET' | 'CHEQUEBOOK' | 'STAMPS' | 'FEEDS' | 'STAKING';
}
export declare function AccountNavigation({ active }: Props): ReactElement;
export {};
