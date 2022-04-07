import { readFileSync, writeFileSync } from 'fs'
import { v4 } from 'uuid'
import { canResolvePath, makePath, resolvePath } from './path'

const API_KEY_FILE = 'api-key.txt'

export function getApiKey() {
  if (!canResolvePath(API_KEY_FILE)) {
    const apiKey = v4()
    writeFileSync(makePath(API_KEY_FILE), apiKey)

    return apiKey
  }

  return readFileSync(resolvePath(API_KEY_FILE), 'utf-8')
}
