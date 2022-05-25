import { shell } from 'electron'
import { getApiKey } from './api-key'
import { port } from './port'

export function openInstallerInBrowser() {
  shell.openExternal(`http://localhost:${port.value}/installer/?v=${getApiKey()}`)
}

export function openDashboardInBrowser() {
  shell.openExternal(`http://localhost:${port.value}/dashboard/?v=${getApiKey()}#/restart`)
}
