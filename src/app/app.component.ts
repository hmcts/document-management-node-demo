import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SessionService} from './auth/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe();
  }

  logout() {
    this.sessionService.clearSession();
  }
}
