import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from 'vitest'

vi.mock('env-paths', () => ({
  default: vi.fn().mockImplementation(() => ({
    data: 'test/data',
    config: 'test/data',
    cache: 'test/data',
    log: 'test/data',
    temp: 'test/data',
  })),
}))

import { checkCompromise, scanLogText } from '../src/compromise-check'
import { logger } from '../src/logger'

const RAN_AT = '2026-11-09T08:15:00.000Z'
const UPDATED_AT = '2026-11-10T09:00:00.000Z'
const PUBLISHED_AT = '2026-11-09T00:41:00.000Z'

const line = (time: string | null, msg: string) => `${time === null ? '' : `time="${time}" `}level="info" msg="${msg}"`
const ran = (version = '0.56.2', time: string | null = RAN_AT) =>
  line(time, `Bee Desktop version: ${version} (production)`)
const updatedFrom = (version = '0.56.2', time: string | null = UPDATED_AT) =>
  line(time, `Desktop version: 9.9.9, desktop file version: ${version}, downloading assets: true`)

describe('scanLogText', () => {
  test.each([
    ['the line written by the compromised version', ran(), RAN_AT],
    ['the "desktop file version" form alone', updatedFrom(), UPDATED_AT],
  ])('finds %s', (_, text, time) => {
    expect(scanLogText(text)).toEqual([Date.parse(time)])
  })

  test.each([
    ['0.56.20', ran('0.56.20')],
    ['10.56.2', ran('10.56.2')],
    ['desktop file version 0.56.20', updatedFrom('0.56.20')],
    ['desktop file version 10.56.2', updatedFrom('10.56.2')],
    ['the string in another message', line(RAN_AT, 'api access uri="Bee Desktop version: 0.56.2 ("')],
  ])('ignores %s', (_, text) => {
    expect(scanLogText(text)).toEqual([])
  })
})

describe('checkCompromise', () => {
  let dir: string
  let info: MockInstance

  const writeLog = (name: string, ...lines: string[]) => writeFileSync(join(dir, name), lines.join('\n'))

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'compromise-check-'))
    info = vi.spyOn(logger, 'info').mockReturnValue(logger)
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  test('finds a match that is only in a rotated file', async () => {
    writeLog('bee-desktop.log', ran('0.56.4'))
    writeLog('bee-desktop7.log', ran())

    expect(await checkCompromise(dir)).toEqual(new Date(RAN_AT))
  })

  test('returns the earliest match across files', async () => {
    writeLog('bee-desktop2.log', ran(), ran('0.56.2', '2026-11-09T18:00:00.000Z'))
    writeLog('bee-desktop1.log', updatedFrom())

    expect(await checkCompromise(dir)).toEqual(new Date(RAN_AT))
  })

  test.each([
    ['an unparseable date', ran('0.56.2', 'not-a-date')],
    ['no time field', ran('0.56.2', null)],
  ])('falls back to the publish time of 0.56.2 for a match with %s', async (_, text) => {
    writeLog('bee-desktop.log', text)

    expect(await checkCompromise(dir)).toEqual(new Date(PUBLISHED_AT))
  })

  test('prefers a parsed date over the fallback', async () => {
    writeLog('bee-desktop.log', ran('0.56.2', 'not-a-date'), updatedFrom())

    expect(await checkCompromise(dir)).toEqual(new Date(UPDATED_AT))
  })

  test('ignores files that are not bee-desktop logs', async () => {
    writeLog('bee.log', ran())
    writeLog('bee-desktop.log.bak', ran())

    expect(await checkCompromise(dir)).toBeUndefined()
  })

  test('returns undefined when the log folder does not exist', async () => {
    expect(await checkCompromise(join(dir, 'missing'))).toBeUndefined()
  })

  test('logs only "positive" and never writes the compromised version string', async () => {
    writeLog('bee-desktop3.log', ran(), updatedFrom())

    await checkCompromise(dir)

    expect(info).toHaveBeenCalledWith('compromise check: positive')
    expect(JSON.stringify(info.mock.calls)).not.toContain('0.56.2')
  })
})
