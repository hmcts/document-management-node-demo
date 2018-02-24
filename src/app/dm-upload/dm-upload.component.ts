import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SessionService} from '../auth/session.service';
import {AppConfig} from '../app.config';
import {WindowService} from '../utils/window.service';

@Component({
  selector: 'app-dm-upload',
  templateUrl: './dm-upload.component.html',
  styleUrls: ['./dm-upload.component.scss']
})
export class DmUploadComponent implements OnInit {

  @ViewChild('dmUploadForm') dmUploadForm;
  jwt: string;
  documents: string;
  error: string;
  page: any;
  fileToUpload: File = null;

  constructor(private http: HttpClient,
              private sessionService: SessionService,
              private windowService: WindowService,
              private config: AppConfig) { }

  ngOnInit() {
    this.jwt = this.sessionService.getSession().token;
    if (!this.jwt) {
      throw new Error('jwt token are required arguments');
    }
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': `${this.sessionService.getSession().token}`
      })
    };
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.error = null;
  }

  uploadDocument() {
    if (this.fileToUpload) {
      this.postFile();
      this.gotoListView();
    } else {
      this.error = new Error('Please upload a file').message;
    }
  }

  gotoListView() {
    this.windowService.locationAssign('/list');
  }

  postFile() {
    const formData: FormData = new FormData();
    formData.append('classification', 'PRIVATE');
    formData.append('files', this.fileToUpload, this.fileToUpload.name);
    formData.append('metadata[userGroup]', 'Group A');
    formData.append('metadata[someref]', 'asfsafhgdsah');
    formData.append('metadata[title]', 'this is a title');

    this.http
      .post<any>(this.config.getDmUploadUrl(), formData, this.getHttpOptions())
      .subscribe();
  }

  cancelUpload() {
    this.gotoListView();
  }
}
