import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CookieModule} from 'ngx-cookie';
import {AppConfig} from '../app.config';
import {SessionService} from '../auth/session.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DmUploadComponent} from './dm-upload.component';
import {WindowService} from '../utils/window.service';
import {DebugElement} from '@angular/core';

let httpMock: HttpTestingController;
let sessionService: SessionService;
let appConfig: AppConfig;
let component: DmUploadComponent;
let fixture: ComponentFixture<DmUploadComponent>;
let element: DebugElement;

const dmGwUrl = 'http://api-gateway.dm.com';
const jwt = '12345';

const configObject = {
  'dm_gw_url': dmGwUrl,
  'dm_upload_url': dmGwUrl + '/documents'
};

describe('DmUploadComponent tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      declarations: [ DmUploadComponent ],
      providers: [SessionService, AppConfig, WindowService]
    })
      .compileComponents();
  }));

  describe('With JWT', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DmUploadComponent);
      component = fixture.componentInstance;
      sessionService = TestBed.get(SessionService);
      sessionService.createSession({
        token: jwt
      });
      httpMock = TestBed.get(HttpTestingController);
      appConfig = TestBed.get(AppConfig);
      appConfig.load();
      const configRequest = httpMock.expectOne('assets/config.json');
      configRequest.flush(configObject);
      component.jwt = jwt;
      element = fixture.debugElement;

      fixture.detectChanges();
    });

  });

  describe('Without JWT', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DmUploadComponent);
      component = fixture.componentInstance;
      sessionService = TestBed.get(SessionService);
      sessionService.createSession({
        // token: jwt
      });
      httpMock = TestBed.get(HttpTestingController);
      component.jwt = null;
      element = fixture.debugElement;

      fixture.detectChanges();
      spyOn(sessionService, 'clearSession');
    });

    it('should display an error with the status', () => {
      expect(element.nativeElement.querySelector('.error-summary').textContent)
        .toContain('Something went wrong!');
    });
  });
});
