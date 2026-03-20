import { existsSync, unlinkSync, writeFileSync } from 'fs-extra'

import { configYamlExists, readConfigYaml, readWalletPasswordOrThrow, writeConfigYaml } from '../src/config'

jest.mock('env-paths', () =>
  jest.fn().mockImplementation(() => ({
    data: 'test/data',
    config: 'test/data',
    cache: 'test/data',
    log: 'test/data',
    temp: 'test/data',
  })),
)

describe('config-yaml module', () => {
  beforeEach(cleanUp)
  afterAll(cleanUp)

  test('check existence', () => {
    expect(configYamlExists()).toBe(false)
    writeFileSync('test/data/config.yaml', '')
    expect(configYamlExists()).toBe(true)
  })

  test('read and write', () => {
    writeFileSync('test/data/config.yaml', 'test: true')
    writeConfigYaml({
      abc: 123,
    })
    expect(readConfigYaml()).toHaveProperty('test', 'true')
    expect(readConfigYaml()).toHaveProperty('abc', '123')
  })

  test('read password', () => {
    expect(() => readWalletPasswordOrThrow()).toThrow('Attempted to read password, but config.yaml is not found')
    writeFileSync('test/data/config.yaml', 'test: true')
    expect(() => readWalletPasswordOrThrow()).toThrow('Attempted to read password, but config.yaml does not contain it')
    writeFileSync('test/data/config.yaml', 'password: test')
    expect(readWalletPasswordOrThrow()).toBe('test')
  })
})

function cleanUp() {
  if (existsSync('test/data/config.yaml')) {
    unlinkSync('test/data/config.yaml')
  }
}
