import { execSync } from 'child_process'
import { unzip } from 'cross-zip'
import { ensureDir, existsSync, writeFileSync } from 'fs-extra'
import fetch from 'node-fetch'
import { arch, platform } from 'os'
import { parse } from 'path'
import { promisify } from 'util'
import { logger } from './logger'
import { getPath, paths } from './path'

const unzipAsync = promisify(unzip)
const thisPlatform = platform()
const thisArch = arch()

export async function runDownloader(): Promise<void> {
  await ensureDir(paths.data)
  await ensureAsset(
    'https://github.com/ethersphere/bee/releases/download/v1.5.1/bee-darwin-amd64',
    'bee',
    'darwin',
    'x64',
    true,
  )
  await ensureAsset(
    'https://github.com/ethersphere/bee/releases/download/v1.5.1/bee-darwin-arm64',
    'bee',
    'darwin',
    'arm64',
    true,
  )
  await ensureAsset(
    'https://github.com/ethersphere/bee/releases/download/v1.5.1/bee-linux-amd64',
    'bee',
    'linux',
    'x64',
    true,
  )
  await ensureAsset(
    'https://github.com/ethersphere/bee/releases/download/v1.5.1/bee-windows-amd64.exe',
    'bee.exe',
    'win32',
    'x64',
  )
  await ensureAsset('https://github.com/ethersphere/bee-desktop/releases/download/v0.1.1/static.zip', 'static.zip')
}

async function ensureAsset(
  url: string,
  target: string,
  requiredPlatform?: string,
  requiredArch?: string,
  chmod?: boolean,
): Promise<void> {
  logger.info(`Checking asset ${url}...`)
  if (requiredPlatform && thisPlatform !== requiredPlatform) {
    logger.info('Skipping because of platform mismatch')

    return
  }

  if (requiredArch && thisArch !== requiredArch) {
    logger.info('Skipping because of arch mismatch')

    return
  }
  const finalPath = getPath(target)

  if (existsSync(finalPath)) {
    logger.info('Skipping, already exists')

    return
  }

  const parsedPath = parse(finalPath)
  logger.info(`Downloading to ${finalPath}...`)
  await downloadFile(url, finalPath)

  if (finalPath.endsWith('.zip')) {
    logger.info('Extracting...')
    await unzipAsync(finalPath, parsedPath.dir)
  }

  if (chmod) {
    logger.info('Running chmod +x...')
    try {
      execSync(`chmod +x "${finalPath}"`)
    } catch (error) {
      logger.error(error)
    }
  }

  logger.info('OK')
}

async function downloadFile(url: string, target: string): Promise<void> {
  return fetch(url)
    .then(async x => x.arrayBuffer())
    .then(x => writeFileSync(target, Buffer.from(x)))
}
