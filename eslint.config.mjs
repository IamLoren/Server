import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 12,
                sourceType: 'module',
            },
            env: {
                es2021: true,
                node: true,
            },
        },
        plugins: {},
        rules: {
            'no-console': 'error',
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
]
