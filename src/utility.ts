export function isRecord(object: unknown): object is Record<string, unknown> {
    return Boolean(object) && typeof object === 'object' && !Array.isArray(object)
}
