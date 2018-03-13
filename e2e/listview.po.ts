import { browser, by, element } from 'protractor';

export class ListViewPage {
  navigateTo() {
    return browser.get('/list');
  }

  getTitleText() {
    return element(by.css('h1[data-hook="dm-listview__heading"]')).getText();
  }
}
