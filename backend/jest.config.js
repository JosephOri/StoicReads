module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/tests/$1',
    '^@src/(.*)': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.test.ts'],
};
