import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import packageJson from '../../package.json'
import { getHost, sendRequest } from './net'

async function getBeeDesktopLogs(): Promise<string> {
  return await sendRequest<string>(`${getHost()}/logs/bee-desktop`, 'GET', undefined, 'string')
}

async function getBeeLogs(): Promise<string> {
  return await sendRequest<string>(`${getHost()}/logs/bee`, 'GET', undefined, 'string')
}

export function initSentry(sentryKey: string): void {
  Sentry.init({
    dsn: sentryKey,
    release: packageJson.version,
    tunnel: `${getHost()}/sentry`,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? 'production',
    integrations: [new BrowserTracing({ tracingOrigins: [getHost()] })],
    tracesSampleRate: 0.4,
    beforeSend: async (event, hint) => {
      hint.attachments = []

      try {
        // This might fail if no logs are present yet
        hint.attachments.push({ filename: 'bee-desktop.log', data: await getBeeDesktopLogs() })
        // eslint-disable-next-line no-empty
      } catch (e) {}

      try {
        // This might fail if no logs are present yet
        hint.attachments.push({ filename: 'bee.log', data: await getBeeLogs() })
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return event
    },
  })
}
