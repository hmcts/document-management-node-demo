import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements  OnInit {

    logoutLink: string;
    navItems: Array<{}>;
    navigations;
    serviceName;
    constructor(public authService: AuthService) {
        this.logoutLink = `/logout?redirect=${encodeURIComponent(this.authService.generateLoginUrl())}`;
    }

    ngOnInit(): void {
        this.navItems = [
            {
                text: 'Home',
                href: '/',
                active: true
            },
            {
                text: 'Document Viewer',
                href: '/document-viewer',
                active: false
            },
            {
                text: 'Document Assembly',
                href: '/assembly',
                active: true
            }
        ];

        this.serviceName = {
            name: 'RPA EM Demo Application',
            url: '/'
        };
        this.navigations = {
            label: 'Account navigation',
            items: [{
                text: 'Sign out',
                href: this.logoutLink
            }]
        };
    }


}
