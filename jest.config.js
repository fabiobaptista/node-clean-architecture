module.exports = {
  roots: ['<rootDir/src>'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDiractory: 'coverage',
  testEnviromment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
