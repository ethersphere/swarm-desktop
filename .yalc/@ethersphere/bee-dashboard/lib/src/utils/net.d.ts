export declare function getJson<T extends Record<string, any>>(url: string): Promise<T>;
export declare function postJson<T extends Record<string, any>>(url: string, data?: Record<string, any>): Promise<T>;
export declare function sendRequest(url: string, method: 'GET' | 'POST', data?: Record<string, unknown>): Promise<Record<string, any>>;
