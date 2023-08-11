import { getHost, sendRequest } from './net'

async function getBeeDesktopLogs(): Promise<string> {
  return await sendRequest<string>(`${getHost()}/logs/bee-desktop`, 'GET', undefined, 'string')
}

async function getBeeLogs(): Promise<string> {
  return await sendRequest<string>(`${getHost()}/logs/bee`, 'GET', undefined, 'string')
}
