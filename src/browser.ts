import { shell } from 'electron'
import { getApiKey } from './api-key'
import { port } from './port'

export function openInstallerInBrowser() {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  shell.openExternal(`http://localhost:${port.value}/installer/?v=${getApiKey()}`)
}

export function openDashboardInBrowser() {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${getApiKey()}`)
}
