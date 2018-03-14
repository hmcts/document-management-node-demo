import { AppPage } from './app.po';
import {before} from 'selenium-webdriver/testing';
import {UploadPage} from './upload.po';
import * as path from 'path';
import {DocumentRow, ListViewPage} from './listview.po';
import {browser, by, element} from 'protractor';
import {async} from 'q';
import {ViewerPage} from './viewer.po';
fdescribe('Upload and Annotate a PDF', () => {
  let page: UploadPage;

  beforeAll(() => {
    page = new UploadPage();
    page.navigateTo();
  });

  describe('when I upload a file', () => {
    const fileToUpload = './files/pdf.pdf',
      absolutePath = path.resolve(__dirname, fileToUpload);
    const listViewPage = new ListViewPage();

    beforeAll(() => {
      browser.wait(page.isLoaded);
    });

    beforeAll(() => {
      page.addFileToUpload(absolutePath).then(() => {
        console.log(`Uploading ${absolutePath}`);
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

    describe('when I click annotate', () => {
      const viewerPage = new ViewerPage();
      beforeAll(() => {
        browser.waitForAngularEnabled(false);
        uploadedDocument.annotate();
      });

      beforeAll(() => {
        return browser.wait(function () {
          return viewerPage.isAnnotationsLoaded();
        }).then(() => {
          browser.waitForAngularEnabled(true);
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

      describe('when I add a note and save', () => {
        const pageOneNote = `A rockin note`;

        beforeAll(() => {
          viewerPage.setCurrentNoteText(pageOneNote);
          viewerPage.getSaveButton().click();
        });

        it('should disable save', () => {
          expect(viewerPage.getSaveButton().isEnabled()).toBe(false);
        });

        it('should disable cancel', () => {
          expect(viewerPage.getCancelButton().isEnabled()).toBe(false);
        });

        it('should display to the note', () => {
          expect(viewerPage.getCurrentNoteText()).toEqual(pageOneNote);
        });

        describe('when I change pages', () => {
          beforeAll(() => {
            viewerPage.nextPage();
          });

          it('should blank out the note for the next page', () => {
            expect(viewerPage.getCurrentNoteText()).toEqual('');
          });
        });

        describe('when I add a note for page 2 and hit save', () => {
          const pageTwoNote = 'Great note on page 2';

          beforeAll(() => {
            viewerPage.setCurrentNoteText(pageTwoNote);
            viewerPage.getSaveButton().click();
          });

          it('should disable save', () => {
            expect(viewerPage.getSaveButton().isEnabled()).toBe(false);
          });

          it('should disable cancel', () => {
            expect(viewerPage.getCancelButton().isEnabled()).toBe(false);
          });

          describe('when i refresh the page', () => {
            beforeAll(() => {
              browser.refresh();
            });

            beforeAll(() => {
              return browser.wait(function () {
                return viewerPage.isAnnotationsLoaded();
              });
            });

            it('should have loaded the page 1 note', () => {
              expect(viewerPage.getCurrentNoteText()).toEqual(pageOneNote);
            });

            describe('when I swap to page 2', () => {
              beforeAll(() => {
                viewerPage.nextPage();
              });

              it('should have loaded page 2 note', () => {
                expect(viewerPage.getCurrentNoteText()).toEqual(pageTwoNote);
              });

              describe('when I flick back to page 1', () => {
                beforeAll(() => {
                  viewerPage.previousPage();
                });

                it('should go back to the page 1 note', () => {
                  expect(viewerPage.getCurrentNoteText()).toEqual(pageOneNote);
                });

                describe('when I update the note, save and refresh', () => {
                  const updatedPageOneNote = 'Updated page 1 note';

                  beforeAll(() => {
                    viewerPage.clearCurrentNote();
                    viewerPage.setCurrentNoteText(updatedPageOneNote);
                    viewerPage.getSaveButton().click();
                  });

                  beforeAll(() => {
                    return browser.wait(function () {
                      return viewerPage.getSaveButton().isEnabled().then(enabled => {
                        console.log(enabled);
                        return !enabled;
                      });
                    });
                  });

                  beforeAll(() => {
                    browser.refresh();
                    return browser.wait(function () {
                      return viewerPage.isAnnotationsLoaded();
                    });
                  });

                  it('should have saved the updated note', () => {
                    expect(viewerPage.getCurrentNoteText()).toEqual(updatedPageOneNote);
                  });

                  describe('when I delete the note, save and refresh', () => {
                    beforeAll(() => {
                      viewerPage.clearCurrentNote();
                      viewerPage.getSaveButton().click();
                    });

                    beforeAll(() => {
                      return browser.wait(function () {
                        return viewerPage.getSaveButton().isEnabled().then(enabled => {
                          console.log(enabled);
                          return !enabled;
                        });
                      });
                    });

                    beforeAll(() => {
                      browser.refresh();
                      return browser.wait(function () {
                        return viewerPage.isAnnotationsLoaded();
                      });
                    });

                    xit('should have deleted the note', () => {
                      expect(viewerPage.getCurrentNoteText()).toEqual('');
                    });
                  });
                });
              });

            });
          });
        });
      });
    });
  });
});
