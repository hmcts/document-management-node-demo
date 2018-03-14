import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.id('proposition-name')).getText();
  }

  getUploadButton() {
    return element(by.css('a.button'));
    // return element(by.css('a[data-hook="listview__document-upload"]'));
  }
}
