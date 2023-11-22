export declare class AuthError extends Error {
    constructor();
}
export declare function isAuthError(error: unknown): error is AuthError;
