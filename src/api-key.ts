import { existsSync, writeFileSync, readFileSync } from 'fs'
import { v4 } from 'uuid'
import { resolvePath } from './path'

const API_KEY_FILE = 'api-key.txt'

export function getApiKey() {
  if (!existsSync(resolvePath(API_KEY_FILE))) {
    const apiKey = v4()
    writeFileSync(resolvePath(API_KEY_FILE), apiKey)

    return apiKey
  }

  return readFileSync(resolvePath(API_KEY_FILE), 'utf-8')
}
