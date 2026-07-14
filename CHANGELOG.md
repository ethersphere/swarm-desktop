# Changelog

## [0.55.0](https://github.com/ethersphere/swarm-desktop/compare/v0.54.1...v0.55.0) (2026-07-14)


### Features

* spdv-1314 ([#28](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/28)) ([c4f58e1](https://github.com/ethersphere/swarm-desktop/commit/c4f58e16cbc47fef9d1f089ff276fcca93e3392b))
* upgrade to bee-dashboard v0.36.0 ([300f275](https://github.com/ethersphere/swarm-desktop/commit/300f2752e1fea42e6ff02dc4b5831871712adec8))


### Bug Fixes

* add ui-local pnpm-workspace.yaml so ui installs standalone ([fc38a98](https://github.com/ethersphere/swarm-desktop/commit/fc38a98a833d198537edb570793557152328de71))
* app menu changes ([#16](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/16)) ([80c5700](https://github.com/ethersphere/swarm-desktop/commit/80c5700764286ea4a9d39a63c1487ca6efd710de))
* don't override macOS dock icon so system tinting works ([#24](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/24)) ([b077ddb](https://github.com/ethersphere/swarm-desktop/commit/b077ddb5b7bc37784cb49134bd5a22846e1536c9))
* express gift wallet fees as human-readable constants ([#18](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/18)) ([2ec3c67](https://github.com/ethersphere/swarm-desktop/commit/2ec3c67bd6308b186892781e6fceeb7d032d8a85))
* notification appears when bee fails and restart loop starts ([#31](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/31)) ([03b1b5a](https://github.com/ethersphere/swarm-desktop/commit/03b1b5a0d0fbbe49ba07f965daa090bf08ed48c8))
* prevent second instance from opening browser tab on launch ([#30](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/30)) ([b0751c4](https://github.com/ethersphere/swarm-desktop/commit/b0751c448fc1ec3e66f7614606e1edafaebb5f6d))
* remove skip-postage-snapshot from default config ([#20](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/20)) ([8cdb4d1](https://github.com/ethersphere/swarm-desktop/commit/8cdb4d14aeb7b865a1da932bee9a20d0a50ad197))
* replace cloudflare-eth resolver SPDV-1296 ([#29](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/29)) ([01d0bcc](https://github.com/ethersphere/swarm-desktop/commit/01d0bcc732e158a32309c22c21444648357ffb67))
* replace tokenservice with bff.cow.fi ([#19](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/19)) ([3911322](https://github.com/ethersphere/swarm-desktop/commit/391132254f8a8465ead8dba2823411d05a10c04f))
* resolve lint errors in index and launcher ([ae2787d](https://github.com/ethersphere/swarm-desktop/commit/ae2787d0991e354475b34b9ba77e6c03801f49c0))
* serialize bee-js v11 BatchId extends Bytes before IPC transfer ([#15](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/15)) ([1f76967](https://github.com/ethersphere/swarm-desktop/commit/1f7696760ec6d6a03d13d64e5e5cd565354e1fbd))
* set DEBUG env variable in MacOS arm64 publish ([defa345](https://github.com/ethersphere/swarm-desktop/commit/defa34509eb80e7e338dc5bfb5baa195fde4f9c1))
* spdv-1263 ([#23](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/23)) ([7ae5634](https://github.com/ethersphere/swarm-desktop/commit/7ae5634672697b6050f7d2bc65ece68260367580))
* spdv-1299 ([#26](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/26)) ([45eeed8](https://github.com/ethersphere/swarm-desktop/commit/45eeed8bd83ffc9b29e1bd7fa37811b2b79828bf))
* spdv-1332 ([#32](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/32)) ([f9ea63f](https://github.com/ethersphere/swarm-desktop/commit/f9ea63fb8a1e98376084517294fd1341751d0601))
* spdv-1344 ([#33](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/33)) ([97c24e8](https://github.com/ethersphere/swarm-desktop/commit/97c24e8e4a9c2ad37312d6a2bba9ab5065335997))
* spdv-958 ([2a158eb](https://github.com/ethersphere/swarm-desktop/commit/2a158eb172b055816213adf21821ceaf805e7948))
* swap error caused by invalid id and batchcount ([6977994](https://github.com/ethersphere/swarm-desktop/commit/697799467438d8934d068f5571bf741a4768ff26))
* tray-menu-text-change ([#25](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/25)) ([0a3495a](https://github.com/ethersphere/swarm-desktop/commit/0a3495ab64205cd5ea50fd2e51dd6c4539327104))
* update decentralized wiki url in electron tray menu spdv-1035 ([#13](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/13)) ([5e0afd6](https://github.com/ethersphere/swarm-desktop/commit/5e0afd6551e34aef858bf1bd33f5b2e0dc6f8b29))
* update etherjot url in taskbar spdv-940 ([#12](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/12)) ([3e33d87](https://github.com/ethersphere/swarm-desktop/commit/3e33d87e8e98470d968543bdf25494b1b3c4b96b))
* update forge config to exclude TS source files, retain assets spdv-1022 ([#11](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/11)) ([9677bf5](https://github.com/ethersphere/swarm-desktop/commit/9677bf59b0a8921282609b37a34ef2d18b6d4758))
* update tray icon on system theme change for Linux and Windows ([#22](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/22)) ([45b4769](https://github.com/ethersphere/swarm-desktop/commit/45b4769d24c108831d4d7419c185d788ed356409))


### Documentation

* readme update ([#27](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/27)) ([320ee04](https://github.com/ethersphere/swarm-desktop/commit/320ee049d283af376b00329648fbe44b4e58edfb))


### Miscellaneous

* merge upstream v0.54.1 (bee v2.8.1) ([f4af9dd](https://github.com/ethersphere/swarm-desktop/commit/f4af9dd362ff2e45a15aa7824c9905c35e9d0544))
* rebuild dashboard bee-js v12.3.1 for bee v2.8.1 API ([#554](https://github.com/ethersphere/swarm-desktop/issues/554)) ([1479375](https://github.com/ethersphere/swarm-desktop/commit/147937569074e0f7a283f44c8de8051329aed128))
* upgrade @ethersphere/bee-dashboard to v0.35.1 ([#17](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/17)) ([b1fce91](https://github.com/ethersphere/swarm-desktop/commit/b1fce91bcfc0984544155bc97ab854df82341a7e))
* upgrade @ethersphere/bee-dashboard to version 0.35.0 spdv-1036 ([#14](https://github.com/Solar-Punk-Ltd/swarm-desktop/pull/14)) ([6077936](https://github.com/ethersphere/swarm-desktop/commit/6077936f0e25695e10fae2b70f514ace7931b005))

## [0.54.1](https://github.com/ethersphere/swarm-desktop/compare/v0.54.0...v0.54.1) (2026-06-24)


### Bug Fixes

* bee v2.8.1 ([#549](https://github.com/ethersphere/swarm-desktop/issues/549)) ([22c195a](https://github.com/ethersphere/swarm-desktop/commit/22c195a349a1be9da1444301a0d547fe721095ab))

## [0.54.0](https://github.com/ethersphere/swarm-desktop/compare/v0.53.1...v0.54.0) (2026-05-26)


### Features

* bee v2.8.0 ([#545](https://github.com/ethersphere/swarm-desktop/issues/545)) ([9af46f3](https://github.com/ethersphere/swarm-desktop/commit/9af46f379730191ea3229c728f31c5ed3aae747c))

## [0.53.1](https://github.com/ethersphere/swarm-desktop/compare/v0.53.1...v0.52.1) (2026-04-10)

### Bug Fixes

- chore: apply new eslint, commitlint rules
- chore: migrate from npm to pnpm
- chore: migrate from webpack to vite
- chore: update all dependencies like react, ethers etc.
- chore: update ci workflow steps
- chore: upgrade bee to v2.7.1
- chore: upgrade @ethersphere/bee-dashboard to v0.35.1
- fix: swap error caused by invalid id and batchcount
- fix: update forge config to exclude ts source files, retain assets
- fix: update decentralized wiki url in electron tray menu
- fix: serialize bee-js v11 batchid extends bytes before ipc transfer
- fix: app menu changes

## [0.52.1](https://github.com/ethersphere/swarm-desktop/compare/v0.52.0...v0.52.1) (2026-02-18)

### Bug Fixes

* update @ethersphere/bee-dashboard to version 0.33.5 ([#523](https://github.com/ethersphere/swarm-desktop/issues/523)) ([33c82f8](https://github.com/ethersphere/swarm-desktop/commit/33c82f8212aea91338d4efbb006aacd167d6660b))
* upgrade to bee 2.7.0 ([#520](https://github.com/ethersphere/swarm-desktop/issues/520)) ([e7d1a2d](https://github.com/ethersphere/swarm-desktop/commit/e7d1a2d542cd92eedeef03faa66d6b53bcb34760))

## [0.52.0](https://github.com/ethersphere/swarm-desktop/compare/v0.51.0...v0.52.0) (2026-01-26)


### Features

* add filemanager ([#506](https://github.com/ethersphere/swarm-desktop/issues/506)) ([d353c97](https://github.com/ethersphere/swarm-desktop/commit/d353c9744c1e78e7b6cc77797f114706a783b31d))


## [0.51.0](https://github.com/ethersphere/swarm-desktop/compare/v0.50.0...v0.51.0) (2025-07-23)


### Features

* force skip-postage-snapshot: true bee:2.6.0 vs. ultra light mode SPDV-520 ([#473](https://github.com/ethersphere/swarm-desktop/issues/473)) ([874df91](https://github.com/ethersphere/swarm-desktop/commit/874df91adbe012aa0d0308c9e8bdaebdaab12215))

## [0.50.0](https://github.com/ethersphere/swarm-desktop/compare/v0.49.0...v0.50.0) (2025-07-22)


### Features

* update to bee 2.6.0 SPDV-509 ([#469](https://github.com/ethersphere/swarm-desktop/issues/469)) ([4855b4b](https://github.com/ethersphere/swarm-desktop/commit/4855b4b213b696572c5ed3be4bf6aac644bb3136))

## [0.49.0](https://github.com/ethersphere/swarm-desktop/compare/v0.48.0...v0.49.0) (2025-03-12)


### Features

* update to bee 2.5.0 ([#461](https://github.com/ethersphere/swarm-desktop/issues/461)) ([37ecf14](https://github.com/ethersphere/swarm-desktop/commit/37ecf14598d7cc4266474673affd8c15d9e87de0))

## [0.48.0](https://github.com/ethersphere/swarm-desktop/compare/v0.47.0...v0.48.0) (2025-01-15)


### Features

* add FDP link to App tray menu ([#458](https://github.com/ethersphere/swarm-desktop/issues/458)) ([378f39d](https://github.com/ethersphere/swarm-desktop/commit/378f39d465b505a412fea1bd27991eec04a78856))
* update to bee-dashboard v0.31.0 ([#457](https://github.com/ethersphere/swarm-desktop/issues/457)) ([173fbc2](https://github.com/ethersphere/swarm-desktop/commit/173fbc23d963a987c484a9aee5f8d43c80dea0b6))

## [0.47.0](https://github.com/ethersphere/swarm-desktop/compare/v0.46.0...v0.47.0) (2024-12-24)


### Features

* update to bee 2.3.2 ([#455](https://github.com/ethersphere/swarm-desktop/issues/455)) ([6e10214](https://github.com/ethersphere/swarm-desktop/commit/6e10214b8b8175fb5b7d53a5235f0a87bdfe8c74))

## [0.46.0](https://github.com/ethersphere/swarm-desktop/compare/v0.45.0...v0.46.0) (2024-11-28)


### Features

* add screenshot plugin ([#451](https://github.com/ethersphere/swarm-desktop/issues/451)) ([d0a3906](https://github.com/ethersphere/swarm-desktop/commit/d0a3906df129c94c5dc40c8870d594328381da22))

## [0.45.0](https://github.com/ethersphere/swarm-desktop/compare/v0.44.0...v0.45.0) (2024-11-25)


### Features

* update to bee-dashboard v0.30.0 ([#452](https://github.com/ethersphere/swarm-desktop/issues/452)) ([8ebaa9e](https://github.com/ethersphere/swarm-desktop/commit/8ebaa9e49c7381d11894fa9b0af74015e371d276))

## [0.44.0](https://github.com/ethersphere/swarm-desktop/compare/v0.43.2...v0.44.0) (2024-11-11)

### Features

* add notable apps and hashes ([#447](https://github.com/ethersphere/swarm-desktop/issues/447)) ([1d8be48](https://github.com/ethersphere/swarm-desktop/commit/1d8be485277333c595b413e444983ef4c24df779))
* datafund app added ([#448](https://github.com/ethersphere/swarm-desktop/issues/448)) ([#449](https://github.com/ethersphere/swarm-desktop/issues/449)) ([4d21617](https://github.com/ethersphere/swarm-desktop/commit/4d216176a75c5d11fdd43b77859e9e982c328bff))

## [0.43.2](https://github.com/ethersphere/swarm-desktop/compare/v0.43.1...v0.43.2) (2024-10-24)


### Bug Fixes

* remove unused properties from first time created config.yaml ([#439](https://github.com/ethersphere/swarm-desktop/issues/439)) ([#440](https://github.com/ethersphere/swarm-desktop/issues/440)) ([3e9c0b7](https://github.com/ethersphere/swarm-desktop/commit/3e9c0b774eb2a7a6996bae4886d63aa43af0b010))

## [0.43.1](https://github.com/ethersphere/swarm-desktop/compare/v0.44.0...v0.41.0) (2024-09-19)

### Features

* Migrate to bee-2.2.0 ([#436](https://github.com/ethersphere/swarm-desktop/issues/436)) ([9874352](https://github.com/ethersphere/swarm-desktop/commit/9874352262fa76dd3df31d83fd616fefdd4dff05))

* update bee dashboard to latest version ([#433](https://github.com/ethersphere/swarm-desktop/issues/433)) ([5a2fe76](https://github.com/ethersphere/swarm-desktop/commit/5a2fe768ccbcfce07fa94b9970b92481a4e8e5be))
