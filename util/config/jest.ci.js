const { modulePathIgnorePatterns, testMatch } = require('./jest.common');

module.exports = {
  testMatch,
  modulePathIgnorePatterns,
  reporters: ['text', 'jest-junit'],
  collectCoverage: true,
};
