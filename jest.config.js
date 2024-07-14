module.exports = {
  roots: [
    "./src", // jest 扫描的目录
  ],
  preset: 'ts-jest',
  transform: {
    "^.+\\.tsx?$": "ts-jest", // 哪些文件需要用 ts-jest 执行
    // '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',

  },
  testEnvironment: 'jsdom',
  "transformIgnorePatterns": [
    "node_modules/(?!(@arcblock/did-connect)/)"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  globals: {
    "ts-jest": {
      tsConfig: './tsconfig.json',
    },
  },
};