module.exports = function(wallaby) {

  return {
    files: [
      '!**/node_modules/**',
      '!src/**/out/**',
      '!src/**/templates/**',
      '!src/**/*.test.ts',
      '!src/**/*.e2e.ts',
      '!**/*.d.ts',
      { pattern: '**/__fixtures__/**', instrument: false },
      { pattern: '**/__snapshots__/**', instrument: false },
      '**/__mocks__/**',
      'src/coq-api/**/*.ts',
    ],
    tests: [
      '!**/node_modules/**',
      'src/coq-api/**/*.test.ts',
    ],
    filesWithNoCoverageCalculated: [
      '**/__mocks__/**',
      '**/__fixtures__/**',
    ],

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',

    compilers: {
      '**/*.ts': wallaby.compilers.babel(),
    },
  };
};
