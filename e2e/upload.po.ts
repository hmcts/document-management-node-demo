import { browser, by, element } from 'protractor';
import {until} from 'selenium-webdriver';
import ableToSwitchToFrame = until.ableToSwitchToFrame;

export class UploadPage {
  navigateTo() {
    return browser.get('/upload');
  }

  getTitleText() {
    return element(by.css('h1[data-hook="dm-upload__heading"]')).getText();
  }

  addFileToUpload(path) {
    return element(by.id('files')).sendKeys(path);
  }

  getUploadButton() {
    return element(by.css('button[data-hook="dm-upload__upload-button"]'));
  }

  isLoaded() {
    return element.all(by.css('button[data-hook="dm-upload__upload-button"]')).count().then(count => {
      console.log(count);
      return count > 0;
    });
  }
}
