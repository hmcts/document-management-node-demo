import { AppPage } from './app.po';

describe('dm-viewer App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have a title', () => {
    expect(page.getTitleText()).toEqual('Document Management Show');
  });

});
