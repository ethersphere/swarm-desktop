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

const archTable = {
  arm64: 'arm64',
  x64: 'amd64',
}

const platformTable = {
  win32: 'windows',
  darwin: 'darwin',
  linux: 'linux',
}

export async function runDownloader(): Promise<void> {
  const archString = Reflect.get(archTable, process.arch)
  const platformString = Reflect.get(platformTable, process.platform)
  const suffixString = process.platform === 'win32' ? '.exe' : ''

  if (!archString || !platformString) {
    throw Error(`Unsupport system: arch=${arch()} platform=${platform()}`)
  }
  await ensureDir(paths.data)
  await ensureAsset(
    `https://github.com/ethersphere/bee/releases/download/v1.5.1/bee-${platformString}-${archString}${suffixString}`,
    `bee${suffixString}`,
    process.platform !== 'win32',
  )
  await ensureAsset('https://github.com/ethersphere/bee-desktop/releases/download/v0.1.1/static.zip', 'static.zip')
}

async function ensureAsset(url: string, target: string, chmod?: boolean): Promise<void> {
  logger.info(`Checking asset ${url}...`)
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
