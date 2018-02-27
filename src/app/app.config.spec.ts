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
    const request = httpMock.expectOne('assert/config.json');
    request.flush({});
  }));
});
