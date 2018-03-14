import { AppPage } from './app.po';
import {before} from 'selenium-webdriver/testing';
import {UploadPage} from './upload.po';
import * as path from 'path';
import {DocumentRow, ListViewPage} from './listview.po';
import {browser, by, element} from 'protractor';
import {async} from 'q';
import {ViewerPage} from './viewer.po';
describe('Upload and View an Image', () => {
  let page: UploadPage;

  beforeAll(() => {
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

    beforeAll(() => {
      browser.wait(page.isLoaded);
    });

    beforeAll(() => {
      page.addFileToUpload(absolutePath).then(() => {
        browser.waitForAngularEnabled(false);
        page.getUploadButton().click();
      });
    });

    beforeAll(() => {
      return browser.wait(function () {
        return listViewPage.hasDocuments();
      }).then(() => {
        browser.waitForAngularEnabled(true);
      });
    });

    let uploadedDocument: DocumentRow;

    beforeAll(() => {
      uploadedDocument = listViewPage.getDocument(0);
    });

    it('should redirect to the list page', () => {
      expect(listViewPage.getTitleText()).toEqual('List View');
    });

    it('should have the uploaded document', () => {
      expect(uploadedDocument.name()).toEqual('image.jpg');
    });

    describe('when I click view', () => {
      const viewerPage = new ViewerPage();
      beforeAll(() => {
        browser.waitForAngularEnabled(false);
        uploadedDocument.view();
      });

      beforeAll(() => {
        return browser.wait(function () {
          return viewerPage.isLoaded();
        }).then(() => {
          browser.waitForAngularEnabled(true);
        });
      });

      it('should open the viewer', () => {
        expect(browser.driver.getCurrentUrl()).toContain('viewer');
      });

      it('should show the file name', () => {
        expect(viewerPage.getTitleText()).toEqual('image.jpg');
      });
    });
  });
});
