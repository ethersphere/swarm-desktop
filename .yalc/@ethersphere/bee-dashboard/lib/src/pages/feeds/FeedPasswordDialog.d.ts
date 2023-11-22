import { ReactElement } from 'react';
interface Props {
    feedName: string;
    onProceed: (password: string) => void;
    onCancel: () => void;
    loading: boolean;
}
export declare function FeedPasswordDialog({ feedName, onProceed, onCancel, loading }: Props): ReactElement;
export {};
