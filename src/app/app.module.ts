import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CookieModule} from 'ngx-cookie';

import {IdamGuard} from './auth/idam.guard';

import { AppComponent } from './app.component';
import { DmListViewComponent } from './dm-listview/dm-listview.component';
import { DmListViewRouteComponent } from './dm-listview/dm-listview-route.component';
import { DmUploadComponent } from './dm-upload/dm-upload.component';
import { DmUploadRouteComponent } from './dm-upload/dm-upload-route.component';

import {AppConfig} from './app.config';
import {WindowService} from './utils/window.service';
import {SessionService} from './auth/session.service';
import {DocumentService} from './utils/document.service';

const appRoutes: Routes = [
  { path: '', canActivate: [IdamGuard], component: DmListViewRouteComponent },
  { path: '', canActivate: [IdamGuard], component: DmListViewRouteComponent },
  { path: 'list', canActivate: [IdamGuard], component: DmListViewRouteComponent },
  { path: 'upload', canActivate: [IdamGuard], component: DmUploadRouteComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DmListViewComponent,
    DmListViewRouteComponent,
    DmUploadComponent,
    DmUploadRouteComponent
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
    HttpModule,
    CookieModule.forRoot()
  ],
  providers: [
    IdamGuard,
    WindowService,
    DocumentService,
    SessionService,
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
