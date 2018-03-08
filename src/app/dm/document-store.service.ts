import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
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

  // TODO: add addtional thing for the postfile thing
  postFile(classification: string, metaDate: Map<string, string>, file: File) {
    const formData: FormData = new FormData();
    formData.append('classification', classification);
    formData.append('files', file, file.name);

    if (metaDate) {
      metaDate.forEach( (v, k) => {
        formData.append('metadata[' + k + ']', v);
        console.log('metadata[' + k + '] = ' + v);
      });
    }
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
