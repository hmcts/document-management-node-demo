import { AppPage } from './app.po';
import {before} from "selenium-webdriver/testing";

describe('dm-viewer App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have a title', () => {
    expect(page.getTitleText()).toEqual('Document Management Show');
  });

  it('should have an upload button', () => {
    expect(page.getUploadButton().isPresent()).toBe(true);
  });

});
