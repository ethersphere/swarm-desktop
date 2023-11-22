import { ReactElement } from 'react';
interface Props {
    address: string | undefined;
    hideBlockie?: boolean;
    transaction?: boolean;
    truncate?: boolean;
}
export default function EthereumAddress(props: Props): ReactElement;
export {};
