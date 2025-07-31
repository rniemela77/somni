module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.{js,ts}', '**/?(*.)+(spec|test).{js,ts}'],
  collectCoverageFrom: [
    'netlify/functions/**/*.js',
    'src/**/*.{js,vue,ts}',
    '!netlify/functions/**/*.test.js',
    '!src/**/*.test.{js,vue,ts}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'vue', 'ts'],
  
  // Handle CSS and other assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(pinia|vue|@vue)/)'
  ]
}; 