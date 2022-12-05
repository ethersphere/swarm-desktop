import { configYamlExists, readConfigYaml, writeConfigYaml } from './config'

export function runMigrations() {
  if (!configYamlExists()) {
    return
  }

  const config = readConfigYaml()

  // TODO: remove this after 1.0.0 release
  // this is a migration path for pioneers
  // who helped testing the early versions
  if (!config.password) {
    writeConfigYaml({ password: 'Test' })
  }

  if (config['swap-endpoint'] && !config['blockchain-rpc-endpoint']) {
    writeConfigYaml({ 'blockchain-rpc-endpoint': config['swap-endpoint'] })
  }
}
