/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest')

// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // roots: ['<rootDir>/test/unit-tests'], // Temporarily disabled - tests removed during Material-UI migration
  roots: ['<rootDir>/test'], // Will scan for any future test files
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        types: ['jest', '@testing-library/jest-dom'],
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '<rootDir>/test/unit-tests/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
};