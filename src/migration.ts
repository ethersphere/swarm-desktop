import { configYamlExists, deleteKeyFromConfigYaml, readConfigYaml, writeConfigYaml } from './config'

export function runMigrations() {
  if (!configYamlExists()) {
    return
  }

  const config = readConfigYaml()

  if (config['skip-postage-snapshot'] !== undefined) {
    deleteKeyFromConfigYaml('skip-postage-snapshot')
  }

  if (config['storage-incentives-enable'] === undefined) {
    writeConfigYaml({ 'storage-incentives-enable': false })
  }

  if (config['swap-endpoint'] && !config['blockchain-rpc-endpoint']) {
    writeConfigYaml({ 'blockchain-rpc-endpoint': config['swap-endpoint'] })
  }

  if (config['chain-enable'] !== undefined) {
    deleteKeyFromConfigYaml('chain-enable')
  }

  if (config['block-hash'] !== undefined) {
    deleteKeyFromConfigYaml('block-hash')
  }

  if (config.transaction !== undefined) {
    deleteKeyFromConfigYaml('transaction')
  }

  if (config['swap-endpoint'] !== undefined) {
    deleteKeyFromConfigYaml('swap-endpoint')
  }

  if (config['use-postage-snapshot'] !== undefined) {
    deleteKeyFromConfigYaml('use-postage-snapshot')
  }

  if (config['admin-password'] !== undefined) {
    deleteKeyFromConfigYaml('admin-password')
  }

  if (config['debug-api-addr'] !== undefined) {
    deleteKeyFromConfigYaml('debug-api-addr')
  }

  if (config['debug-api-enable'] !== undefined) {
    deleteKeyFromConfigYaml('debug-api-enable')
  }
}
