// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
var remote = require('selenium-webdriver/remote');

const { SpecReporter } = require('jasmine-spec-reporter');

// const url = 'http://webshow.test.dm.reform.hmcts.net';
const url = process.env.APP_URL || 'http://localhost:3608';
// const idamUrl = `https://idam-test.dev.ccidam.reform.hmcts.net/login?continue-url=${url}`;
const idamUrl = `${process.env.IDAM_URL || 'https://localhost:3501'}/login?continue-url=${url}`;
const username = 'test@TEST.com';
const password = '123';

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  // directConnect: true,
  seleniumAddress: process.env.WEB_DRIVER_HOST,
  baseUrl: url,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 10000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    browser.setFileDetector(new remote.FileDetector());

    browser.waitForAngularEnabled(false);

    browser.driver.get(idamUrl);

    browser.driver.findElement(by.id('username')).sendKeys(username);

    browser.driver.findElement(by.id('password')).sendKeys(password);
    browser.driver.findElement(by.css('input.button ')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        // console.log(url);
        const regexp = new RegExp(`^${url.replace('/', '\/')}$`);
        // console.log(regexp);
        let test = regexp.test(url);
        // console.log('is true =' + test);
        return test;
      });
    }).then(() => {
      browser.waitForAngularEnabled(true);
    });
  }
};
