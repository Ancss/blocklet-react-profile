const { join } = require('path');

module.exports = {
  root: true,
  extends: '@arcblock/eslint-config-ts',
  parserOptions: {
    project: [join(__dirname, 'tsconfig.eslint.json'), join(__dirname, 'tsconfig.json')],
  },
  plugins: ['import'],

  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': ['error', 'never', { ignorePackages: true }],
  },
  settings: {
    alias: {
      map: [['@', './src']],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
};
