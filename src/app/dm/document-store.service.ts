import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {SessionService} from '../auth/session.service';

@Injectable()
export class DocumentStoreService {

  constructor(private http: HttpClient,
              private sessionService: SessionService,
              private config: AppConfig) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': `${this.sessionService.getSession().token}`
      })
    };
  }

  // private getHttpOptions() {
  //   return {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.sessionService.getSession().token}`,
  //       'Accept': 'application/json'
  //     })
  //   };
  // }


  postFile(classification: string, metaDate: Object, file: File) {
    const formData: FormData = new FormData();
    formData.append('classification', classification);
    formData.append('files', file, file.name);
    // formData.append('metadata[userGroup]', 'Group A');
    // formData.append('metadata[someref]', 'asfsafhgdsah');
    // formData.append('metadata[title]', 'this is a title');

    return this.http.post<any>(this.config.getDmUploadUrl(), formData, this.getHttpOptions());
  }

  deleteDocument(url: string) {
    return this.http.delete(url, this.getHttpOptions());
  }

  getCreatorDocuments(page: number, sortby: string, order: string, size: number)  {
    return this.http.post<any>(this.getDmFindByCreatorUrlWithParams(page, sortby, order, size), null, this.getHttpOptions());
  }

  private getDmFindByCreatorUrlWithParams(page: number, sortby: string, order: string, size: number) {
    return this.config.getDmFindByCreatorUrl()
      + '?page=' + page
      + '&sort=' + sortby + ',' + order
      + '&size=' + size;
  }
}
