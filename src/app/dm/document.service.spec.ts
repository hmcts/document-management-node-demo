import {DocumentStoreService} from './document-store.service';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AppConfig} from '../config/app.config';
import {HttpClient} from '@angular/common/http';
import {HttpTestingController} from '@angular/common/http/testing';

let httpMock: HttpTestingController;
let appConfig: AppConfig;
let component: DocumentStoreService;
let fixture: ComponentFixture<DocumentStoreService>;

const configObject = {
  'dm_store_app_local_endpoint': '/demproxy/dm/',
};

describe('DocumentStoreService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [DocumentStoreService],
      providers: [HttpClient, AppConfig]
    })
      .compileComponents();
  }));

  describe('Test ConvertUrlToProxy', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DocumentStoreService);
      component = fixture.componentInstance;
      httpMock = TestBed.get(HttpTestingController);
      appConfig = TestBed.get(AppConfig);
      appConfig.load();
      const configRequest = httpMock.expectOne('assets/config.json');
      configRequest.flush(configObject);
      fixture.detectChanges();
    });

    // it('ConvertUrlToProxy', () => {
    //   expect(component.convertUrlToProxy('http://localhost:8080/testUrl'))
    //     .toEqual('/demproxy/dm/testUrl');
    // });

  });

});
