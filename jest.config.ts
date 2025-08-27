import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // Keeps tests simple: look for *.spec.ts like Angular does
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'mjs'],
  // If you use path aliases in tsconfig, map them here too
  // moduleNameMapper: { '^@app/(.*)$': '<rootDir>/src/app/$1' },
};
export default config;
