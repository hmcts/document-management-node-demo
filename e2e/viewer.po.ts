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

  isAnnotationsLoaded() {
    return element.all(by.css('#currentNote')).count().then((count => {
      return count > 0;
    }));
  }

  getTitleText() {
    return element(by.css('h1[data-hook="dm.viewer.docName"]')).getText();
  }

  getCurrentNoteText() {
    return element(by.css('#currentNote')).getAttribute('value');
  }

  setCurrentNoteText(note) {
    return element(by.css('#currentNote')).sendKeys(note);
  }

  nextPage() {
    // Obviously change this to use hooks
    return element.all(by.css('app-em-viewer .button')).get(1).click();
  }

  previousPage() {
    return element.all(by.css('app-em-viewer .button')).get(0).click();
  }

  getSaveButton() {
    return element.all(by.css('#notesForm button')).get(0);
  }

  getCancelButton() {
    return element.all(by.css('#notesForm button')).get(1);
  }
}
