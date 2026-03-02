import { readFileSync, writeFileSync } from 'fs'
import { v4 } from 'uuid'

import { checkPath, getPath } from './path'

const API_KEY_FILE = 'api-key.txt'

export function ensureApiKey(): void {
  if (!checkPath(API_KEY_FILE)) {
    const apiKey = v4()
    writeFileSync(getPath(API_KEY_FILE), apiKey)
  }
}

export function getApiKey() {
  return readFileSync(getPath(API_KEY_FILE), 'utf-8')
}
