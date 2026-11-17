import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { logger } from './logger'
import { paths } from './path'

const COMPROMISED_VERSION_LINE =
  /^(?:time="([^"]*)")?.*\bmsg="(?:Bee Desktop version: 0\.56\.2 \(|Desktop version: [^,"]*, desktop file version: 0\.56\.2,)/

const COMPROMISED_VERSION_PUBLISHED = Date.parse('2026-11-09T00:41:00Z')

const DESKTOP_LOG_FILE = /^bee-desktop\d*\.log$/

export function scanLogText(text: string): number[] {
  return text.split('\n').flatMap(line => {
    const match = COMPROMISED_VERSION_LINE.exec(line)

    return match ? [Date.parse(match[1] ?? '')] : []
  })
}

export async function checkCompromise(logDir: string = paths.log): Promise<Date | undefined> {
  const fileNames = await readdir(logDir).catch((): string[] => [])
  const texts = await Promise.all(
    fileNames
      .filter(name => DESKTOP_LOG_FILE.test(name))
      .map(name => readFile(join(logDir, name), { encoding: 'utf8' }).catch(() => '')),
  )
  const times = texts.flatMap(scanLogText)

  logger.info(`compromise check: ${times.length > 0 ? 'positive' : 'negative'}`)

  if (times.length === 0) return undefined

  const validTimes = times.filter(Number.isFinite)

  return new Date(validTimes.length > 0 ? Math.min(...validTimes) : COMPROMISED_VERSION_PUBLISHED)
}
