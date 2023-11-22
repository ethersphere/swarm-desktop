export declare enum HISTORY_KEYS {
    UPLOAD_HISTORY = "UPLOAD_HISTORY",
    DOWNLOAD_HISTORY = "DOWNLOAD_HISTORY"
}
export interface HistoryItem {
    createdAt: number;
    name: string;
    hash: string;
}
export declare function putHistory(key: string, hash: string, name: string): void;
export declare function getHistorySafe(key: string): HistoryItem[];
export declare function determineHistoryName(hash: string, indexDocument?: string | null): string;
