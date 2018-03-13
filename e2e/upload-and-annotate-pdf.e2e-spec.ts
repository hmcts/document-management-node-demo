import { AppPage } from './app.po';
import {before} from 'selenium-webdriver/testing';
import {UploadPage} from './upload.po';
import * as path from 'path';
import {DocumentRow, ListViewPage} from './listview.po';
import {browser, by, element} from 'protractor';
import {async} from 'q';
import {ViewerPage} from './viewer.po';
describe('Upload and Annotate a PDF', () => {
  let page: UploadPage;

  beforeEach(() => {
    page = new UploadPage();
    page.navigateTo();
  });

  describe('when I upload a file', () => {
    const fileToUpload = './files/pdf.pdf',
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

    describe('when I click annotate', () => {
      const viewerPage = new ViewerPage();
      beforeEach(() => {
        uploadedDocument.annotate();
      });

      beforeEach(() => {
        return browser.wait(function () {
          return viewerPage.isAnnotationsLoaded();
        });
      });

      it('should open the viewer', () => {
        expect(browser.driver.getCurrentUrl()).toContain('viewer');
      });

      it('should show the file name', () => {
        expect(viewerPage.getTitleText()).toEqual('pdf.pdf');
      });

      it('should initialise with a blank note', () => {
        expect(viewerPage.getCurrentNoteText()).toEqual('');
      });

      describe('when I add a note', () => {
        const note = `A rockin' note`;

        beforeEach(() => {
          viewerPage.setCurrentNoteText(note);
        });

        it('should display to the note', () => {
          expect(viewerPage.getCurrentNoteText()).toEqual(note);
        });

        describe('when I change pages', () => {
          beforeEach(() => {
            viewerPage.nextPage();
          });

          it('should blank out the note for the next page', () => {
            expect(viewerPage.getCurrentNoteText()).toEqual('');
          });
        });

        describe('when I change pages back', () => {
          beforeEach(() => {
            viewerPage.previousPage();
          });

          it('should blank out the note for the next page', () => {
            expect(viewerPage.getCurrentNoteText()).toEqual(note);
          });
        });
      });

    });
  });
});
