#!/usr/bin/env node

import envPaths from 'env-paths'
import open from 'open'

import cpy from 'cpy'
import { readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'

const paths = envPaths('Swarm Desktop', { suffix: '' })
const requestedCommand = process.argv[2]

switch (requestedCommand) {
  case 'open:installer':
    await openInstaller()
    break
  case 'copy:installer':
    await copyInstaller()
    break
  case 'copy:dashboard':
    await copyDashboard()
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

function purgeData() {
  return rm(paths.data, { recursive: true, force: true })
}

function purgeLogs() {
  return rm(paths.log, { recursive: true, force: true })
}

function copyInstaller() {
  return cpy('.', join('..', '..', 'dist', 'ui'), { cwd: join('ui', 'build') })
}

function copyDashboard() {
  return cpy('.', join('..', '..', 'dist', 'dashboard'), { cwd: join('dashboard', 'build') })
}

async function openInstaller() {
  const apiKey = await readFile(join(paths.data, 'api-key.txt'), { encoding: 'utf-8' })
  const url = `http://localhost:3002/?v=${apiKey}#/`

  console.log('Opening: ' + url)
  await open(url)
}
