import { existsSync, writeFileSync, readFileSync } from 'fs'
import { v4 } from 'uuid'
import { resolvePath } from './path'

export function getApiKey() {
    if (!existsSync(resolvePath('api-key.txt'))) {
        const apiKey = v4()
        writeFileSync(resolvePath('api-key.txt'), apiKey)
        return apiKey
    }
    return readFileSync(resolvePath('api-key.txt'), 'utf-8')
}
