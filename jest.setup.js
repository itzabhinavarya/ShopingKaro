// Mock process.mainModule for tests
if (!process.mainModule) {
  process.mainModule = { filename: __filename };
}
