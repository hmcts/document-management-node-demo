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
import { AssemblyModule } from 'rpa-dg-docassembly-webcomponent';
import { AssemblyComponent } from './pages/generic-page/assembly/assembly.component';

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
    },
    {
        path: 'assembly',
        component: GenericPageComponent,
        children: [
            {
                path: '',
                component: AssemblyComponent,
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
        AssemblyModule,
        GovukModule,
        HmctsModule
    ],
    declarations: [
        GenericPageComponent,
        DemoComponent,
        AssemblyComponent,
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
