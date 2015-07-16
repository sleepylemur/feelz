exports.config = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 50000
  },
  baseUrl: 'http://localhost:3000',

  specs: ['test/e2e/*.js'],
  capabilities: {
    'browserName': 'chrome'
  }
}
