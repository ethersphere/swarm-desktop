import { ReactElement } from 'react';
import { Identity } from '../../providers/Feeds';
interface Props {
    identity: Identity;
    onClose: () => void;
}
export declare function ExportFeedDialog({ identity, onClose }: Props): ReactElement;
export {};
