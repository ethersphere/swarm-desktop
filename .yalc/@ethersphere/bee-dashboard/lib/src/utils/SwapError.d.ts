export declare class SwapError extends Error {
    snackbarMessage: string;
    originalError?: Error;
    constructor(snackbarMessage: string, error?: Error);
}
export declare function isSwapError(error: unknown): error is SwapError;
export declare function wrapWithSwapError<T>(promise: Promise<T>, snackbarMessage: string): Promise<T>;
