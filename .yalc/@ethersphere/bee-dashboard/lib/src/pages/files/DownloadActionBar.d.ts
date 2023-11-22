import { ReactElement } from 'react';
interface Props {
    onOpen: () => void;
    onCancel: () => void;
    onDownload: () => void;
    onUpdateFeed: () => void;
    hasIndexDocument: boolean;
    loading: boolean;
}
export declare function DownloadActionBar({ onOpen, onCancel, onDownload, onUpdateFeed, hasIndexDocument, loading, }: Props): ReactElement;
export {};
