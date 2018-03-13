// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

const url = 'http://webshow.test.dm.reform.hmcts.net';
const idamUrl = `https://idam-test.dev.ccidam.reform.hmcts.net/login?continue-url=${url}`;
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
  directConnect: true,
  baseUrl: url,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
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
    });
  }
};
