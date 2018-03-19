import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CookieModule} from 'ngx-cookie';

import {IdamGuard} from './auth/idam.guard';

import {AppComponent} from './app.component';
import {DmListViewComponent} from './dm-listview/dm-listview.component';
import {DmListViewRouteComponent} from './dm-listview/dm-listview-route.component';
import {DmUploadComponent} from './dm-upload/dm-upload.component';
import {DmUploadRouteComponent } from './dm-upload/dm-upload-route.component';

import {SessionService} from './auth/session.service';
import {AppConfig} from './config/app.config';
import {WindowService} from './utils/window.service';
import {DocumentService} from './utils/document.service';
import {DocumentStoreService} from './dm/document-store.service';
import {EmAnnotationSummaryModule, EmViewerModule} from 'em-viewer-web';
import {EmViewerRouteComponent} from './em/em-viewer-route.component';
import {EmAnnotationSummaryRouteComponent} from './em/em-annotation-summary-route.component';

const appRoutes: Routes = [
  { path: '', canActivate: [IdamGuard], component: DmListViewRouteComponent },
  { path: 'list', canActivate: [IdamGuard], component: DmListViewRouteComponent },
  { path: 'upload', canActivate: [IdamGuard], component: DmUploadRouteComponent },
  { path: 'viewer', canActivate: [IdamGuard], component: EmViewerRouteComponent },
  { path: 'summary', canActivate: [IdamGuard], component: EmAnnotationSummaryRouteComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    DmListViewComponent,
    DmListViewRouteComponent,
    DmUploadComponent,
    DmUploadRouteComponent,
    EmViewerRouteComponent,
    EmAnnotationSummaryRouteComponent
  ],
  entryComponents: [],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    EmViewerModule,
    EmAnnotationSummaryModule,
    CookieModule.forRoot()
  ],
  providers: [
    IdamGuard,
    WindowService,
    DocumentService,
    DocumentStoreService,
    SessionService,
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
