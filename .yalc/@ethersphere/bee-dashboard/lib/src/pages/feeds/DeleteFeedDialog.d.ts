import { ReactElement } from 'react';
import { Identity } from '../../providers/Feeds';
interface Props {
    identity: Identity;
    onConfirm: (identity: Identity) => void;
    onClose: () => void;
}
export declare function DeleteFeedDialog({ identity, onConfirm, onClose }: Props): ReactElement;
export {};
