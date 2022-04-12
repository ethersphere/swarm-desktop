/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  runner: '@kayahr/jest-electron-runner/main',
  testEnvironment: 'node',
};
