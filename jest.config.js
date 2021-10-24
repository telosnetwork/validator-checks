// import pathsToModuleNameMapper from 'ts-jest/utils';
// import compilerOptions from './tsconfig';

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    "services": "<rootDir>/src/services/index",
    "types": "<rootDir>/src/types/index"
  },
  
}
