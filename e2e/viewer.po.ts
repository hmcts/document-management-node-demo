import { browser, by, element } from 'protractor';
import {until} from 'selenium-webdriver';
import ableToSwitchToFrame = until.ableToSwitchToFrame;

export class ViewerPage {
  navigateTo() {
    return browser.get('/viewer');
  }

  isLoaded() {
    return element.all(by.css('h1[data-hook="dm.viewer.docName"]')).count().then((count => {
      return count > 0;
    }));
  }

  getTitleText() {
    return element(by.css('h1[data-hook="dm.viewer.docName"]')).getText();
  }

}
