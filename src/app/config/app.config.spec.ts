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
      dm_store_app_local_endpoint: '/demproxy/dm/',
      em_anno_app_local_endpoint: '/demproxy/an/',
      em_redact_app_local_endpoint: '/demproxy/re/',
      dm_upload_url: '/demproxy/dm/documents',
      dm_find_documents_by_creator_url: '/demproxy/dm/documents/owned/',
      dm_find_documents_by_metadata_url: '/demproxy/dm/documents/filter/'
    });

    it('should load login_url', () => {
      expect(appConfig.getLoginUrl()).toEqual('https://localhost:3501/login');
    });

    it('should load dm_store_app_local_endpoint', () => {
      expect(appConfig.getDmStoreAppLocalUrl()).toEqual('/demproxy/dm/');
    });

    it('should load em_anno_app_local_endpoint', () => {
      expect(appConfig.getEmAnnoAppLocalUrl()).toEqual('/demproxy/an/');
    });

    it('should load em_redact_app_local_endpoint', () => {
      expect(appConfig.getEmRedactAppLocalUrl()).toEqual('/demproxy/re/');
    });

    it('should load dm_find_documents_by_creator_url', () => {
      expect(appConfig.getDmStoreSearchCreatorUrl()).toEqual('/demproxy/dm/documents/owned/');
    });

    it('should load dm_find_documents_by_metadata_url', () => {
      expect(appConfig.getDmStoreSearchMetadataUrl()).toEqual('/demproxy/dm/documents/filter/');
    });

  }));
});
