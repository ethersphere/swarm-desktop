interface DetectedIndex {
    indexPath: string;
    commonPrefix?: string;
}
export declare function detectIndexHtml(files: FilePath[]): DetectedIndex | false;
export declare function getHumanReadableFileSize(bytes: number): string;
export declare function getAssetNameFromFiles(files: FilePath[]): string;
export declare function getMetadata(files: FilePath[]): Metadata;
export declare function getPath(file: FilePath): string;
/**
 * Utility function that is needed to have correct directory structure as webkitRelativePath is read only
 */
export declare function packageFile(file: FilePath, pathOverwrite?: string): FilePath;
export {};
