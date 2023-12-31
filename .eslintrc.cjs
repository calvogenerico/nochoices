module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    ignorePatterns: ['docs/**/*', 'dist/**/*'],
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
};