import parentConfig from '../eslint.config.mjs'
const uiTestConfig = {
  files: ['src/**/*.spec.ts'],
  rules: {
    'no-console': 'off',
    'import/no-commonjs': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'max-nested-callbacks': ['error', 10],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  plugins: parentConfig[parentConfig.length - 1].plugins,
  languageOptions: {
    globals: {
      ...parentConfig[parentConfig.length - 1].languageOptions.globals,
      require: 'readonly',
      module: 'readonly',
      exports: 'readonly',
    },
  },
}

export default [...parentConfig, uiTestConfig]
