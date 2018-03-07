import {Component, Input, OnInit} from '@angular/core';
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

  @Input() page: number;
  @Input() sortby: string;
  @Input() order: string;
  @Input() size: number;
  jwt: string;
  documents: string;
  error: string;
  dmPage: DmPage;

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
    this.http.post<any>(this.getDmFindByCreatorUrlWithParams(), null, this.getHttpOptions())
      .subscribe(
        resp => {
          if (resp.page) { this.dmPage = resp.page; }
          if (resp && resp._embedded && resp._embedded.documents) {
            this.documents = resp._embedded.documents;
          } else {
            this.documents = null;
            this.error = 'No Documents Found, Try Uploading a File.';
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

  get getEmViewerUrl(): string {
    return this.config.getEmViewerUrl();
  }

  private getDmFindByCreatorUrlWithParams() {
    return this.config.getDmFindByCreatorUrl()
      + '?page=' + this.page
      + '&sort=' + this.sortby + ',' + this.order
      + '&size=' + this.size;
  }

  get getCurrentPage(): number {
    return this.dmPage.number + 1;
  }

  get getTotalPage(): number {
    return (this.dmPage.totalPages < 1) ? 1 : this.dmPage.totalPages;
  }

  firstPage() {
    this.page = 0;
    this.refresh();
  }

  lastPage() {
    this.page = this.dmPage.totalPages - 1;
    this.refresh();
  }

  prevPage() {
    if (this.canPrevPage()) {
      this.page--;
      this.refresh();
    }
  }

  nextPage() {
    if (this.canNextPage()) {
      this.page++;
      this.refresh();
    }
  }


  canPrevPage() {
    return this.page > 0;
  }

  canNextPage() {
    return this.page < this.dmPage.totalPages - 1;
  }

}


