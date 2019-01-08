import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, Event} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    title = 'Em Web Show';

    constructor(private router: Router) {}

    ngOnInit() {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                const replacedTitles = this.replacedTitles(event.url);
                this.title = this.getTitle(replacedTitles);
            }
        });
    }

    private replacedTitles(url: string): string {
        if (url.indexOf('summary') !== -1) {
            return 'summary';
        }
        if (url.indexOf('parties') !== -1) {
            return 'parties';
        }
        return '/';
    }

    private getTitle(key): string {
       const titleMapping: {[id: string]: string} = {
           '/' : 'RPA Demo app'
       };

       return titleMapping[key];
    }
}
