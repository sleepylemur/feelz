exports.config = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 50000
  },
  baseUrl: 'http://localhost:3000',
  // seleniumServerJar:
  // './node_modules/selenium/lib/runner/selenium-server-standalone-2.20.0.jar',

  specs: ['test/e2e/*.js'],
  capabilities: {
    'browserName': 'chrome'
  }
}
