import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DmListViewComponent } from './dm-listview.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {SessionService} from '../auth/session.service';
import {CookieModule} from 'ngx-cookie';
import {AppConfig} from '../config/app.config';
import {WindowService} from '../utils/window.service';
import {DebugElement} from '@angular/core';
import {DocumentStoreService} from '../dm/document-store.service';
import {DocumentService} from '../utils/document.service';

const dmGwUrl = 'http://api-gateway.dm.com';
const ownedDocumentUrl = '/demproxy/dm/documents/owned/';
const jwt = '12345';
const urlParams = '?page=0&sort=desc,createdOn&size=5';

const configObject = {
  'dm_find_documents_by_creator_url': '/demproxy/dm/documents/owned/',
};

const ownedDocuments = {
  '_embedded' : {
    'documents' : [ {
      'size' : 96316,
      'mimeType' : 'image/jpeg',
      'originalDocumentName' : 'jpg.jpg',
      'createdBy' : '28',
      'lastModifiedBy' : '28',
      'modifiedOn' : '2018-03-07T09:20:57.484+0000',
      'createdOn' : '2018-03-07T09:20:57.508+0000',
      'classification' : 'PRIVATE',
      'roles' : [ ],
      'metadata' : {},
      '_links' : {
        'self' : {
          'href' : dmGwUrl + '/documents/12345'
        },
        'binary' : {
          'href' : dmGwUrl + '/documents/12345/binary'
        },
        'thumbnail' : {
          'href' : dmGwUrl + '/documents/12345/thumbnail'
        }
      },
      '_embedded' : {
        'allDocumentVersions' : {
          '_embedded' : {
            'documentVersions' : [ {
              'size' : 96316,
              'mimeType' : 'image/jpeg',
              'originalDocumentName' : 'IMG-20180201-WA0003.jpg',
              'createdBy' : '28',
              'createdOn' : '2018-03-07T09:20:57.508+0000',
              '_links' : {
                'document' : {
                  'href' : dmGwUrl + '/documents/12345'
                },
                'self' : {
                  'href' : dmGwUrl + '/documents/12345/versions/1'
                },
                'binary' : {
                  'href' : dmGwUrl + '/documents/12345/versions/1/binary'
                },
                'thumbnail' : {
                  'href' : dmGwUrl + '/documents/12345/versions/1/thumbnail'
                }
              }
            } ]
          }
        }
      }
    } ]
  },
  '_links' : {
    'self' : {
      'href' : dmGwUrl + '/documents/owned' + urlParams
    }
  },
  'page' : {
    'size' : 5,
    'totalElements' : 1,
    'totalPages' : 1,
    'number' : 0
  }
};


describe('DmListViewComponent tests', () => {
  let httpMock: HttpTestingController;
  let sessionService: SessionService;
  let appConfig: AppConfig;
  let component: DmListViewComponent;
  let fixture: ComponentFixture<DmListViewComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      declarations: [ DmListViewComponent ],
      providers: [SessionService, AppConfig, WindowService, DocumentStoreService, DocumentService]
    })
      .compileComponents();
  }));

  describe('With JWT', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(DmListViewComponent);
      component = fixture.componentInstance;
      sessionService = TestBed.get(SessionService);
      sessionService.createSession(jwt);
      httpMock = TestBed.get(HttpTestingController);
      appConfig = TestBed.get(AppConfig);
      appConfig.load();
      const configRequest = httpMock.expectOne('assets/config.json');
      configRequest.flush(configObject);
      component.jwt = jwt;
      element = fixture.debugElement;

      fixture.detectChanges();
    }));


    describe('returns 0 item', () => {
      beforeEach(async(() => {
        const req = httpMock.expectOne(ownedDocumentUrl + urlParams);
        req.flush({});
        fixture.whenStable().then(() => fixture.detectChanges());
      }));

      it('should display document name', () => {
        expect(element.nativeElement.querySelector('h1').textContent).toEqual('List View');
      });

      it('should display an error with the status', () => {
        expect(element.nativeElement.querySelector('.error-summary').textContent)
          .toContain('No Documents Found, Try Uploading a File.');
      });

      it('should only have one row', () => {
        expect(element.nativeElement.querySelector('tr'));
      });
    });

    describe('returns 1 item', () => {
      beforeEach(() => {
        const req = httpMock.expectOne(ownedDocumentUrl + urlParams);
        req.flush(ownedDocuments);
        fixture.detectChanges();
      });

      it('should display document name', () => {
        expect(element.nativeElement.querySelector('h1').textContent).toEqual('List View');
      });

      it('should only have one row', () => {
      });
    });

    describe('returns 2 item', () => {
      beforeEach(() => {
        const req = httpMock.expectOne(ownedDocumentUrl + urlParams);
        req.flush(ownedDocuments);
        fixture.detectChanges();
      });

      it('should display document name', () => {
        expect(element.nativeElement.querySelector('h1').textContent).toEqual('List View');
      });

      it('should only have one row', () => {
        expect(element.nativeElement.querySelector('tr'));
      });
    });

  });

  // describe('Without JWT', () => {
  //   beforeEach(async(() => {
  //     fixture = TestBed.createComponent(DmListViewComponent);
  //     component = fixture.componentInstance;
  //     sessionService = TestBed.get(SessionService);
  //     sessionService.createSession({
  //       // token: jwt
  //     });
  //     httpMock = TestBed.get(HttpTestingController);
  //     appConfig = TestBed.get(AppConfig);
  //     appConfig.load();
  //     const configRequest = httpMock.expectOne('assets/config.json');
  //     configRequest.flush(configObject);
  //     element = fixture.debugElement;
  //
  //     fixture.detectChanges();
  //     spyOn(sessionService, 'clearSession');
  //   }));
  //
  //   it('should display an error with the status', () => {
  //     expect(element.nativeElement.querySelector('.error-summary').textContent)
  //       .toContain('jwt token are required arguments');
  //   });
  // });
});
