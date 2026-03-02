import { shell } from 'electron'

import { getApiKey } from './api-key'
import { port } from './port'

export function openDashboardInBrowser() {
  shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${getApiKey()}`)
}

export function openUrl(url: string) {
  shell.openExternal(url)
}

export function openPath(path: string) {
  shell.openExternal(`http://localhost:${port.value}/dashboard/?#${path}`)
}
