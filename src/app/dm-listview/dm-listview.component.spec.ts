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
import {By} from '@angular/platform-browser';

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


const zeroOwnedDocuments = {};
const oneOwnedDocuments = {
  '_embedded' : {
    'documents' : [ {
      'originalDocumentName' : 'jpg.jpg',
      'createdBy' : '28',
      'modifiedOn' : '2018-03-07T09:20:57.484+0000',
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
      }
    } ]
  },
  'page' : {
    'size' : 5,
    'totalElements' : 1,
    'totalPages' : 1,
    'number' : 0
  }
};
const twoOwnedDocuments = {
  '_embedded' : {
    'documents' : [
      {
        'originalDocumentName' : 'jpg1.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/1'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/1/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/1/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg2.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/2'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/2/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/2/thumbnail'
          }
        }
      }
    ]
  },
  'page' : {
    'size' : 5,
    'totalElements' : 2,
    'totalPages' : 1,
    'number' : 0
  }
};
const sevenOwnedDocuments = {
  '_embedded' : {
    'documents' : [
      {
        'originalDocumentName' : 'jpg1.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/1'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/1/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/1/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg2.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/2'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/2/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/2/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg3.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/2'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/3/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/3/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg4.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/4'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/4/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/4/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg5.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/5'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/5/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/5/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg6.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/6'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/6/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/6/thumbnail'
          }
        }
      },
      {
        'originalDocumentName' : 'jpg7.jpg',
        'createdBy' : '28',
        'modifiedOn' : '2018-03-07T09:20:57.484+0000',
        '_links' : {
          'self' : {
            'href' : dmGwUrl + '/documents/7'
          },
          'binary' : {
            'href' : dmGwUrl + '/documents/7/binary'
          },
          'thumbnail' : {
            'href' : dmGwUrl + '/documents/7/thumbnail'
          }
        }
      }
    ]
  },
  'page' : {
    'size' : 5,
    'totalElements' : 7,
    'totalPages' : 2,
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
        httpMock.expectOne(ownedDocumentUrl + urlParams)
          .flush(zeroOwnedDocuments);
        fixture.detectChanges();
      }));

      it('should display an error with the status', () => {
        expect(element.nativeElement.querySelector('.error-summary').textContent)
          .toContain('No Documents Found, Try Uploading a File.');
      });

      it('should only have no row', () => {
        expect(element.queryAll(By.css('tr[data-hook="dm-listview__document"]')).length).toBe(0);
      });
    });

    describe('returns 1 item', () => {
      beforeEach(() => {
        httpMock.expectOne(ownedDocumentUrl + urlParams)
          .flush(oneOwnedDocuments);
        fixture.detectChanges();
      });

      it('should only have one row', () => {
        expect(element.queryAll(By.css('tr[data-hook="dm-listview__document"]')).length).toBe(1);
      });

    });

    describe('returns 2 item', () => {
      beforeEach(() => {
        httpMock.expectOne(ownedDocumentUrl + urlParams)
          .flush(twoOwnedDocuments);
        fixture.detectChanges();
      });

      it('should only have two row', () => {
        expect(element.queryAll(By.css('tr[data-hook="dm-listview__document"]')).length).toBe(2);
      });
    });

    describe('returns 7 item', () => {
      beforeEach(() => {
        httpMock.expectOne(ownedDocumentUrl + urlParams)
          .flush(sevenOwnedDocuments);
        fixture.detectChanges();
      });

      it('should only have seven row', () => {
        expect(element.queryAll(By.css('tr[data-hook="dm-listview__document"]')).length).toBe(7);
      });
    });

    describe('returns 401 error', () => {
      beforeEach(() => {
        spyOn(sessionService, 'clearSession').and.callFake(() => {});
        httpMock.expectOne(ownedDocumentUrl + urlParams)
          .flush({}, {
            status: 401,
            statusText: 'unAuth'
          });
        fixture.detectChanges();
      });

      it('should clear session', () => {
        expect(sessionService.clearSession).toHaveBeenCalled();
      });
    });

    describe('returns 4xx error', () => {
      beforeEach(() => {
        httpMock.expectOne(ownedDocumentUrl + urlParams)
          .flush({}, {
            status: 403,
            statusText: 'forbid'
          });
        fixture.detectChanges();
      });

      it('should not display list', () => {
        expect(element.nativeElement.querySelector('.error-summary').textContent)
          .toContain('Response status was 403.');
      });

      it('should display an error with the status', () => {
        expect(element.nativeElement.querySelector('.error-summary').textContent)
          .toContain('Response status was 403.');
      });
    });

  });

});
