#!/usr/bin/env node

import envPaths from 'env-paths'
import open from 'open'

import cpy from 'cpy'
import { readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const DEFAULT_VITE_DEV_PORT = 3002
const API_KEY_FILE = 'api-key.txt'
const paths = envPaths('Swarm Desktop', { suffix: '' })
const requestedCommand = process.argv[2]

switch (requestedCommand) {
  case 'open:ui':
    await openUi()
    break
  case 'copy:ui':
    await copyUi()
    break
  case 'purge:data':
    await purgeData()
    break
  case 'purge:logs':
    await purgeLogs()
    break
  default:
    throw new Error(`Unknown command "${requestedCommand}"!`)
}

async function purgeData() {
  return rm(paths.data, { recursive: true, force: true })
}

async function purgeLogs() {
  return rm(paths.log, { recursive: true, force: true })
}

async function copyUi() {
  return cpy('.', join('..', '..', 'dist', 'ui'), { cwd: join('ui', 'build') })
}

async function openUi() {
  const apiKey = await readFile(join(paths.data, API_KEY_FILE), { encoding: 'utf-8' })
  const url = `http://localhost:${DEFAULT_VITE_DEV_PORT}/?v=${apiKey}#/`

  console.log('Opening: ' + url)
  await open(url)
}
