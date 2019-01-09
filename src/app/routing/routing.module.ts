import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from '../auth/auth-guard.service';
import { RedirectionService } from './redirection.service';
import { GovukModule } from '../govuk/govuk.module';
import { HmctsModule } from '../hmcts/hmcts.module';
import { GenericPageComponent } from './pages/generic-page/generic-page.component';
import { CookiesComponent } from './pages/generic-page/cookies/cookies.component';
import { DemoComponent } from './pages/generic-page/demo/demo.component';

const routes: Routes = [
    {
        path: '',
        component: GenericPageComponent,
        children: [
            {
                path: '',
                component: DemoComponent,
                canActivate: [AuthGuardService],
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled'
        }),
        HttpClientModule,
        ReactiveFormsModule,
        GovukModule,
        HmctsModule
    ],
    declarations: [
        GenericPageComponent,
        DemoComponent,
        CookiesComponent
    ],
    providers: [
        RedirectionService
    ],
    exports: [
        RouterModule
    ]
})

export class RoutingModule {
}
