// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://webshow.test.dm.reform.hmcts.net',
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

    browser.driver.get('https://idam-test.dev.ccidam.reform.hmcts.net/login?continue-url=https://webshow.test.dm.reform.hmcts.net');

    browser.driver.findElement(by.id('username')).sendKeys('test@TEST.com');
    browser.driver.findElement(by.id('password')).sendKeys('123');
    browser.driver.findElement(by.css('input.button ')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        console.log(url);
        let test = /^https:\/\/webshow.test.dm.reform.hmcts.net\/$/.test(url);
        console.log('is true =' + test);
        return test;
      });
    });

  }
};
