import { shell } from 'electron'
import { getApiKey } from './api-key'
import { port } from './port'

export function openDashboardInBrowser() {
  shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${getApiKey()}`)
}
