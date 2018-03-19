import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from '../auth/session.service';
import {AppConfig} from '../config/app.config';
import {DocumentStoreService} from '../dm/document-store.service';
import {DocumentService} from '../utils/document.service';


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

  @Input() page = 0;
  @Input() sortby = 'desc';
  @Input() order = 'createdOn';
  @Input() size = 5;
  jwt: string;
  documents: string;
  error: string;
  dmPage: DmPage;

  constructor(private sessionService: SessionService,
              private documentStoreService: DocumentStoreService) { }

  ngOnInit() {
    this.jwt = this.sessionService.getSession();
    this.refresh();
  }

  refresh() {
    this.documentStoreService.getCreatorDocuments(this.page, this.sortby, this.order, this.size).subscribe(
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

  convertUrlToProxy(url: string): string {
    return this.documentStoreService.convertUrlToProxy(url);
  }

  deleteDocument(url: string) {
    this.documentStoreService.deleteDocument(url).subscribe(() => this.refresh());
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


