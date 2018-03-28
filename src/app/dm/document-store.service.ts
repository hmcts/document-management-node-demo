import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {SessionService} from '../auth/session.service';
import {DocumentService} from '../utils/document.service';

@Injectable()
export class DocumentStoreService {

  constructor(private http: HttpClient,
              private documentService: DocumentService,
              private sessionService: SessionService,
              private config: AppConfig) {}

  // private getHttpOptions() {
  //   return {
  //     headers: new HttpHeaders({
  //       'Authorization': `${this.sessionService.getSession()}`
  //     })
  //   };
  // }

  convertUrlToProxy(url: string): string {
    const URLsplit = url.split('/');
    const host = URLsplit[0] + '//' + URLsplit[2] + '/';
    return url.replace(host, this.config.getDmStoreAppLocalUrl());
  }

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
    return this.http.post<any>(this.config.getDmStoreUploadUrl(), formData);
  }

  deleteDocument(url: string) {
    return this.http.delete(this.convertUrlToProxy(url));
  }

  getCreatorDocuments(page: number, sortby: string, order: string, size: number)  {
    return this.http.post<any>(this.getDmFindByCreatorUrlWithParams(page, sortby, order, size), null);
  }

  private getDmFindByCreatorUrlWithParams(page: number, sortby: string, order: string, size: number) {
    return this.config.getDmStoreSearchCreatorUrl()
      + '?page=' + page
      + '&sort=' + sortby + ',' + order
      + '&size=' + size;
  }
}
