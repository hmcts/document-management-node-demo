import {AppConfig} from './app.config';
import {async, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('AppConfig tests', () => {
  let httpMock: HttpTestingController;
  let appConfig: AppConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [AppConfig]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    httpMock = TestBed.get(HttpTestingController);
    appConfig = TestBed.get(AppConfig);
    appConfig.load();
    const request = httpMock.expectOne('assets/config.json');
    request.flush({
        login_url: 'https://localhost:3501/login',
        dm_gw_url: 'http://localhost:3603',
        dm_upload_url: 'http://localhost:3603/documents',
        dm_find_documents_by_creator_url: 'http://localhost:3603/documents/owned/',
        dm_find_documents_by_metadata_url: 'http://localhost:3603/documents/filter/',
        em_viewer_url: 'http://localhost:3621'
      }
    );
  }));

  it('should load login_url', () => {
    expect(appConfig.getLoginUrl()).toEqual('https://localhost:3501/login');
  });

  it('should load dm_gw_url', () => {
    expect(appConfig.getDmGwUrl()).toEqual('http://localhost:3603');
  });

  it('should load dm_upload_url', () => {
    expect(appConfig.getDmUploadUrl()).toEqual('http://localhost:3603/documents');
  });

  it('should load dm_find_documents_by_creator_url', () => {
    expect(appConfig.getDmFindByCreatorUrl()).toEqual('http://localhost:3603/documents/owned/');
  });

  it('should load dm_find_documents_by_metadata_url', () => {
    expect(appConfig.getDmFindByMetadatUrl()).toEqual('http://localhost:3603/documents/filter/');
  });

  it('should load em_viewer_url', () => {
    expect(appConfig.getEmViewerUrl()).toEqual('http://localhost:3621');
  });

});
