import { AppPage } from './app.po';
import {before} from 'selenium-webdriver/testing';
import {UploadPage} from './upload.po';
import * as path from 'path';
import {ListViewPage} from './listview.po';
import {browser} from 'protractor';
describe('dm-viewer App', () => {
  let page: UploadPage;

  beforeEach(() => {
    page = new UploadPage();
    page.navigateTo();
  });

  it('should have a title', () => {
    expect(page.getTitleText()).toEqual('Upload Document');
  });

  describe('when I upload a file', () => {
    const fileToUpload = './files/image.jpg',
      absolutePath = path.resolve(__dirname, fileToUpload);
    const listViewPage = new ListViewPage();

    beforeEach(async() => {
      page.addFileToUpload(absolutePath).then(() => {
        page.getUploadButton().click();
      });
    });

    beforeEach(async() => {
      return browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return url.includes('list');
        });
      });
    });

    it('should redirect to the list page', () => {
      expect(listViewPage.getTitleText()).toEqual('List View');
    });
  });


});
