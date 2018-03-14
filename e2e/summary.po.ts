import {browser, by, element, ElementFinder} from 'protractor';
import {until} from 'selenium-webdriver';
import ableToSwitchToFrame = until.ableToSwitchToFrame;

export class Annotation {
  constructor(private elementFinder: ElementFinder) {

  }


  getCreatedBy() {
    return this.elementFinder.element(by.css('h3[data-hook="em.anno.summary.annotation.createdBy"')).getText();
  }

  getCreatedOn() {
    return this.elementFinder.element(by.css('h3[data-hook="em.anno.summary.annotation.createdOn"')).getText();
  }

  getText() {
    return this.elementFinder.element(by.css('.lede')).getText();
  }


  getPage() {
    return this.elementFinder.element(by.css('a[data-hook="em.anno.summary.annotation.link"')).getText();
  }
}

export class SummaryPage {
  navigateTo() {
    return browser.get('/summary');
  }

  isLoaded() {
    return element.all(by.css('div[data-hook="em.anno.summary.annotation"]')).count().then((count => {
      return count > 0;
    }));
  }

  getNumberOfAnnotations() {
    return element.all(by.css('div[data-hook="em.anno.summary.annotation"]')).count();
  }

  getAnnotation(index: number) {
    return new Annotation(element.all(by.css('div[data-hook="em.anno.summary.annotation"]')).get(index));
  }




}
