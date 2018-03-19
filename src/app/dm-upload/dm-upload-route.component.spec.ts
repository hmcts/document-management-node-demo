import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DebugElement} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs/observable/of';
import {DmUploadRouteComponent} from './dm-upload-route.component';

describe('DmUploadRouteComponent', () => {

  let component: DmUploadRouteComponent;
  let fixture: ComponentFixture<DmUploadRouteComponent>;
  let element: DebugElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DmUploadRouteComponent ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParams: of()
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DmUploadRouteComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  }));

  describe('when the compnent is created', () => {

  });
});

