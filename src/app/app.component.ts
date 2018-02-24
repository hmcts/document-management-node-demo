import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SessionService} from './auth/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  url: string;

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService) { }

  logout() {
    this.sessionService.clearSession();
  }
}
