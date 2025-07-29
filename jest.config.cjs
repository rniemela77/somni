module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'netlify/functions/**/*.js',
    'src/**/*.{js,vue,ts}',
    '!netlify/functions/**/*.test.js',
    '!src/**/*.test.{js,vue,ts}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  transform: {},
  extensionsToTreatAsEsm: [],
  moduleFileExtensions: ['js', 'json', 'vue'],
  
  // Handle CSS and other assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  }
}; 