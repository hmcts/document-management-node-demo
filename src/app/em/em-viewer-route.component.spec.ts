import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DebugElement} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs/observable/of';
import {EmViewerRouteComponent} from './em-viewer-route.component';

describe('EmAnnotationSummaryRoute', () => {

  let component: EmViewerRouteComponent;
  let fixture: ComponentFixture<EmViewerRouteComponent>;
  let element: DebugElement;

  const documentUrl = 'http://localhost:4603/document/1234';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ EmViewerRouteComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({
            url : documentUrl,
            annotate: false
          })
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmViewerRouteComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  }));

  describe('when the compnent is created', () => {

    it('has Url', () => {
      expect(component.url).toEqual(documentUrl);
    });

    it('has Annotate', () => {
      expect(component.annotate).toEqual(false);
    });
  });
});

