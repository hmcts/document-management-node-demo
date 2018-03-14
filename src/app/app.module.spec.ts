import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('DmUploadComponent tests', () => {
  let component;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppModule],
      declarations: [],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.createComponent(AppComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
