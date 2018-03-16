import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CookieModule} from 'ngx-cookie';
import {AppConfig} from '../config/app.config';
import {SessionService} from '../auth/session.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DmUploadComponent} from './dm-upload.component';
import {WindowService} from '../utils/window.service';
import {DebugElement} from '@angular/core';
import {DocumentStoreService} from '../dm/document-store.service';
import {DocumentService} from '../utils/document.service';

let httpMock: HttpTestingController;
let sessionService: SessionService;
let windowService: WindowService;
let appConfig: AppConfig;
let component: DmUploadComponent;
let fixture: ComponentFixture<DmUploadComponent>;
let element: DebugElement;

const jwt = '12345';

const configObject = {
  'dm_store_app_local_endpoint': '/demproxy/dm/',
  'dm_upload_url': '/demproxy/dm/documents'
};

describe('DmUploadComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      declarations: [ DmUploadComponent ],
      providers: [SessionService, AppConfig, WindowService, DocumentService, DocumentStoreService]
    })
      .compileComponents();
  }));

  describe('With JWT', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DmUploadComponent);
      component = fixture.componentInstance;
      sessionService = TestBed.get(SessionService);
      sessionService.createSession(jwt);
      httpMock = TestBed.get(HttpTestingController);
      appConfig = TestBed.get(AppConfig);
      appConfig.load();
      const configRequest = httpMock.expectOne('assets/config.json');
      configRequest.flush(configObject);
      element = fixture.debugElement;

      fixture.detectChanges();
    });

    it('document upload header is here', () => {
      expect(element.nativeElement.querySelector('h1.heading-large').textContent)
        .toContain('Upload Document');
    });

    describe('handle input', () => {
      beforeEach(() => {
        //  handleFileInput(files: FileList)
      });
    });

    describe('handle upload with no Document', () => {
      beforeEach(async(() => {
        component.fileToUpload = null;
        component.uploadDocument();
        fixture.whenStable().then(() => fixture.detectChanges());
      }));

      it('should display an error with the status', () => {
        expect(element.nativeElement.querySelector('.error-summary').textContent)
          .toContain('You have not selected a file for upload.');
      });
    });

    describe('Successful Post', () => {
      // uploadDocument() {
      // postFile() {
      // gotoListView() {

      beforeEach(() => {
        // component.fileToUpload = new File([''], 'test.jpg');
        windowService = TestBed.get(WindowService);
        component.uploadDocument();
        fixture.whenStable().then(() => fixture.detectChanges());
      });

      it('document upload header is here', () => {
        expect(element.nativeElement.querySelector('h1.heading-large').textContent)
          .toContain('Upload Document');
      });

      it('redirect to list view', () => {
        expect(element.nativeElement.querySelector('h1.heading-large').textContent)
          .toContain('Upload Document');
      });

    });

    // describe('UnSuccessful Post', () => {
    //
    // });

  });

  // describe('Without JWT', () => {
  //   beforeEach(() => {
  //     fixture = TestBed.createComponent(DmUploadComponent);
  //     component = fixture.componentInstance;
  //     sessionService = TestBed.get(SessionService);
  //     sessionService.createSession(null);
  //     component.jwt = null;
  //     httpMock = TestBed.get(HttpTestingController);
  //     appConfig = TestBed.get(AppConfig);
  //     appConfig.load();
  //     const configRequest = httpMock.expectOne('assets/config.json');
  //     configRequest.flush(configObject);
  //     element = fixture.debugElement;
  //
  //     fixture.whenStable().then(() => fixture.detectChanges());
  //     spyOn(sessionService, 'clearSession');
  //   });
  //
  //   it('document upload header is here', () => {
  //     expect(element.nativeElement.querySelector('h1.heading-large').textContent)
  //       .toContain('Upload Document');
  //   });
  //
  //   it('should display an error with the status', () => {
  //     expect(element.nativeElement.querySelector('.error-summary').textContent)
  //       .toContain('jwt token are required arguments');
  //   });
  // });
});
