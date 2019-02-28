import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {APP_ID, Inject, NgModule, PLATFORM_ID} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { ConfigService } from './config.service';
import {AuthModule} from './auth/auth.module';
import {HmctsModule} from './hmcts/hmcts.module';
import {GovukModule} from './govuk/govuk.module';
import {RouterModule} from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HmctsEmViewerUiModule } from '@hmcts/annotation-ui-lib';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent
    ],
    imports: [
        RouterModule,
        BrowserModule.withServerTransition({appId: 'jui'}),
        BrowserTransferStateModule,
        RoutingModule,
        HttpClientModule,
        HmctsModule,
        GovukModule,
        AuthModule,
        HmctsEmViewerUiModule
    ],
    providers: [
        ConfigService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              @Inject(APP_ID) private appId: string) {
    }
}
