import * as path from 'path'
import { fileURLToPath } from 'url'

import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const compat = await import(`${__dirname}/eslint-compat.cjs`)
const js = compat.default.js
const ts = compat.default.ts
const tsParser = compat.default.tsParser
const prettier = compat.default.prettier
const importPlugin = compat.default.importPlugin
const pluginJest = compat.default.pluginJest
const prettierPlugin = compat.default.prettierPlugin
const simpleImportSort = compat.default.simpleImportSort
const react = compat.default.react

const eslintRecommended = js.configs.recommended

const typescriptRecommended = {
  plugins: {
    '@typescript-eslint': ts,
  },
  rules: {
    ...ts.configs.recommended.rules,
  },
}

const importRules = {
  plugins: {
    import: importPlugin,
  },
  rules: {
    ...importPlugin.configs.errors.rules,
    ...importPlugin.configs.warnings.rules,
    ...importPlugin.configs.typescript.rules,
  },
}

const prettierRecommended = {
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    'prettier/prettier': 'error',
    ...prettier.rules,
  },
}

export default defineConfig([
  reactHooks.configs.flat.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      'eslint.config.mjs',
      'eslint-compat.cjs',
      'assets/**',
      'commitlint.config.cjs',
      'test/data/**',
      '*.html',
    ],
  },
  {
    files: ['**/*.ts', '**/*.js', '*.mjs', '*.js'],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        require: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        NodeJS: 'readonly',
        __dirname: 'readonly',
        HTMLElementTagNameMap: 'readonly',
        HTMLInputElement: 'readonly',
        document: 'readonly',
        clearInterval: 'readonly',
        setInterval: 'readonly',
        module: 'readonly',
        File: 'readonly',
        AbortController: 'readonly',
      },
    },
  },
  eslintRecommended,
  typescriptRecommended,
  importRules,
  prettierRecommended,
  prettier,
  {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      '@typescript-eslint': ts,
      'simple-import-sort': simpleImportSort,
      react: react,
    },
    rules: {
      'array-bracket-newline': ['error', 'consistent'],
      strict: ['error', 'safe'],
      'block-scoped-var': 'error',
      complexity: 'warn',
      'default-case': 'error',
      'dot-notation': 'warn',
      eqeqeq: 'error',
      'guard-for-in': 'warn',
      'linebreak-style': ['warn', 'unix'],
      'no-alert': 'error',
      'no-case-declarations': 'error',
      'no-console': 'off',
      'no-constant-condition': 'error',
      'no-continue': 'warn',
      'no-div-regex': 'error',
      'no-empty': 'warn',
      'no-empty-pattern': 'error',
      'no-implicit-coercion': 'error',
      'prefer-arrow-callback': 'warn',
      'no-labels': 'error',
      'no-loop-func': 'error',
      'no-nested-ternary': 'warn',
      'no-script-url': 'error',
      'quote-props': ['error', 'as-needed'],
      'require-yield': 'error',
      'max-depth': ['error', 4],
      'require-await': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'no-useless-constructor': 'off',
      'no-dupe-class-members': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      curly: ['error', 'multi-line'],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-dupe-class-members': 'error',
      'react/react-in-jsx-scope': 'off',
      'max-nested-callbacks': ['error', 4],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@?\\w'], // Packages
            ['^\\u0000'], // Side effect imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Other relative imports
            ['^.+\\.?(css)$'], // Style imports
          ],
        },
      ],
    },
  },
  {
    // tests
    files: ['test/**/*.spec.ts'],
    rules: {
      'no-console': 'off',
      'import/no-commonjs': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'max-nested-callbacks': ['error', 10], // allow describe/it/test nesting
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
  },
])
