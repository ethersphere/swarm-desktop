import { ReactElement } from 'react';
interface Props {
    step: number;
    onUpload: () => void;
    onCancel: () => void;
    onGoBack: () => void;
    onProceed: () => void;
    isUploading: boolean;
    hasStamp: boolean;
    hasAnyStamps: boolean;
    uploadLabel: string;
    stampMode: 'BUY' | 'SELECT';
    setStampMode: (mode: 'BUY' | 'SELECT') => void;
}
export declare function UploadActionBar({ step, onUpload, onCancel, onGoBack, onProceed, isUploading, hasStamp, hasAnyStamps, uploadLabel, stampMode, setStampMode, }: Props): ReactElement;
export {};
