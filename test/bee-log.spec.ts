import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'fs'
import { EOL } from 'os'
import { PassThrough } from 'stream'

jest.mock('env-paths', () =>
  jest.fn().mockImplementation(() => ({
    data: 'test/data',
    config: 'test/data',
    cache: 'test/data',
    log: 'test/data',
    temp: 'test/data',
  })),
)

import { createBeeLogger, forwardLines } from '../src/logger'

const LOG_DIR = 'test/data/bee-log-test'

async function waitFor(condition: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now()
  while (!condition()) {
    if (Date.now() - start > timeoutMs) return
    await new Promise(resolve => setTimeout(resolve, 25))
  }
}

function collectLines(chunks: string[]): Promise<string[]> {
  return new Promise(resolve => {
    const stream = new PassThrough()
    const lines: string[] = []
    forwardLines(stream, line => lines.push(line))
    stream.on('end', () => resolve(lines))
    for (const chunk of chunks) {
      stream.write(chunk)
    }
    stream.end()
  })
}

function endLogger(logger: ReturnType<typeof createBeeLogger>): Promise<void> {
  return new Promise(resolve => {
    logger.on('finish', () => resolve())
    logger.end()
  })
}

describe('forwardLines', () => {
  test('reassembles lines that are split across chunks', async () => {
    const lines = await collectLines(['hel', 'lo\nwor', 'ld\n', 'trailing-no-newline'])
    expect(lines).toEqual(['hello', 'world', 'trailing-no-newline'])
  })

  test('normalises CRLF and preserves empty lines', async () => {
    const lines = await collectLines(['a\r\n', '\n', 'b\r\n'])
    expect(lines).toEqual(['a', '', 'b'])
  })
})

describe('createBeeLogger', () => {
  beforeEach(() => {
    rmSync(LOG_DIR, { recursive: true, force: true })
    mkdirSync(LOG_DIR, { recursive: true })
  })

  afterAll(() => {
    rmSync(LOG_DIR, { recursive: true, force: true })
  })

  test('writes lines verbatim, without a timestamp or level prefix', async () => {
    const filename = `${LOG_DIR}/bee.log`
    const beeLog = createBeeLogger({ filename, maxsize: 1_000_000, maxFiles: 3 })

    beeLog.info('2026-07-22T10:00:00Z raw bee output line')
    await endLogger(beeLog)
    await waitFor(() => existsSync(filename) && readFileSync(filename, 'utf8').length > 0)

    expect(readFileSync(filename, 'utf8')).toBe(`2026-07-22T10:00:00Z raw bee output line${EOL}`)
  })

  test('rotates by size and keeps at most maxFiles files', async () => {
    const filename = `${LOG_DIR}/bee.log`
    const beeLog = createBeeLogger({ filename, maxsize: 256, maxFiles: 3 })

    const beeFiles = () => readdirSync(LOG_DIR).filter(file => file.startsWith('bee'))
    const readAll = () =>
      beeFiles()
        .map(file => readFileSync(`${LOG_DIR}/${file}`, 'utf8'))
        .join('')

    const line = 'x'.repeat(60)
    for (let batch = 0; batch < 6; batch++) {
      for (let i = 0; i < 3; i++) {
        beeLog.info(line)
      }
      await waitFor(() => false, 60)
    }
    beeLog.end()
    await waitFor(() => beeFiles().length >= 2 && readAll().includes(line), 8000)

    const files = beeFiles()
    expect(files.length).toBeGreaterThanOrEqual(2)
    expect(files.length).toBeLessThanOrEqual(3)

    const content = readAll()
    expect(content).toContain(line)
    expect(content).not.toMatch(/info:|"level"/)
  }, 15000)
})
