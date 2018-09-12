import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CookieModule} from 'ngx-cookie';

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

import {ViewerComponent} from './viewer/viewer.component';
import { CommentsComponent } from './viewer/comments/comments.component';
import { ScrollEventModule } from 'ngx-scroll-event';
import { ToolbarComponent } from './viewer/toolbar/toolbar.component';

const appRoutes: Routes = [
  { path: '',  component: DmListViewRouteComponent },
  { path: 'list',  component: DmListViewRouteComponent },
  { path: 'upload',  component: DmUploadRouteComponent },
  { path: 'viewer',  component: ViewerComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    DmListViewComponent,
    DmListViewRouteComponent,
    DmUploadComponent,
    DmUploadRouteComponent,
    ViewerComponent,
    CommentsComponent,
    ToolbarComponent
  ],
  entryComponents: [],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }, // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CookieModule.forRoot(),
    ScrollEventModule
  ],
  providers: [
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
