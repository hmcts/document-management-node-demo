import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DebugElement} from '@angular/core';
import {EmAnnotationSummaryRouteComponent} from './em-annotation-summary-route.component';
import {EmAnnotationSummaryModule} from 'em-viewer-web';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs/observable/of';

describe('EmAnnotationSummaryRoute', () => {

  let component: EmAnnotationSummaryRouteComponent;
  let fixture: ComponentFixture<EmAnnotationSummaryRouteComponent>;
  let element: DebugElement;

  const documentUrl = 'http://localhost:4603/document/1234';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EmAnnotationSummaryModule, HttpClientTestingModule],
      declarations: [ EmAnnotationSummaryRouteComponent ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({url : documentUrl})
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmAnnotationSummaryRouteComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  }));

  describe('when the compnent is created', () => {

    it('has Url', () => {
      expect(component.url).toEqual(documentUrl);
    });
  });
});

