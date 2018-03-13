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

    beforeEach(() => {
      page.addFileToUpload(absolutePath).then(() => {
        page.getUploadButton().click();
      });
    });

    beforeEach(() => {
      return browser.wait(function () {
        return listViewPage.hasDocuments();
      });
    });

    let uploadedDocument: DocumentRow;

    beforeEach(() => {
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
      beforeEach(() => {
        uploadedDocument.view();
      });

      beforeEach(() => {
        return browser.wait(function () {
          return viewerPage.isLoaded();
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
