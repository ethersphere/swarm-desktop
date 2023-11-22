import { ReactChild, ReactElement } from 'react';
export declare type UploadOrigin = {
    origin: 'UPLOAD' | 'FEED';
    uuid?: string;
};
export declare const defaultUploadOrigin: UploadOrigin;
interface ContextInterface {
    files: FilePath[];
    setFiles: (files: FilePath[]) => void;
    uploadOrigin: UploadOrigin;
    setUploadOrigin: (uploadOrigin: UploadOrigin) => void;
    metadata?: Metadata;
    previewUri?: string;
    previewBlob?: Blob;
}
export declare const Context: import("react").Context<ContextInterface>;
export declare const Consumer: import("react").Consumer<ContextInterface>;
interface Props {
    children: ReactChild;
}
export declare function Provider({ children }: Props): ReactElement;
export {};
