import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SessionService} from '../auth/session.service';
import {AppConfig} from '../app.config';


export class DmPage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

@Component({
  selector: 'app-dm-listview',
  templateUrl: './dm-listview.component.html',
  styleUrls: ['./dm-listview.component.scss']
})
export class DmListViewComponent implements OnInit {

  jwt: string;
  documents: string;
  error: string;
  page: DmPage;

  constructor(private http: HttpClient,
              private sessionService: SessionService,
              private config: AppConfig) { }

  ngOnInit() {
    this.jwt = this.sessionService.getSession().token;
    if (!this.jwt) {
      throw new Error('jwt token are required arguments');
    }
    this.refresh();
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.sessionService.getSession().token}`,
        'Accept': 'application/json'
      })
    };
  }

  deleteDocument(url: string) {
    this.http.delete(url, this.getHttpOptions())
      .subscribe(() => this.refresh());
  }

  refresh() {
    this.http.post<any>(this.config.getDmFindByCreatorUrl(), null, this.getHttpOptions())
      .subscribe(
        resp => {
          if (resp && resp._links) {
            this.documents = resp._embedded.documents;
            this.page = resp.page;
          }
        },
        err => {
          if (err.status === 401) {
            this.sessionService.clearSession();
            return;
          }
          this.error = err;
        });
  }

}
