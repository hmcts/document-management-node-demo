import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionService} from '../auth/session.service';
import {WindowService} from '../utils/window.service';
import {DocumentStoreService} from '../dm/document-store.service';

@Component({
  selector: 'app-dm-upload',
  templateUrl: './dm-upload.component.html',
  styleUrls: ['./dm-upload.component.scss']
})
export class DmUploadComponent implements OnInit {

  jwt: string;
  error: string;
  fileToUpload: File = null;

  constructor(private sessionService: SessionService,
              private documentService: DocumentStoreService,
              private windowService: WindowService) {}

  ngOnInit() {
    this.jwt = this.sessionService.getSession();
    if (!this.jwt) {
      throw new Error('jwt token are required arguments');
    }
  }

  handleFileInput(file: File) {
    this.fileToUpload = file;
    this.error = null;
  }

  uploadDocument() {
    if (this.fileToUpload) {
      this.postFile();
    } else {
      this.error = new Error('You have not selected a file for upload.').message;
    }
  }

  postFile() {
    const metadataObj: Map<string, string> = new Map<string, string>();
    // metadataObj.set('title', 'some random Title');
    // metadataObj.set('author', 'Joe');
    // metadataObj.set('cake', 'yesplease');

    this.documentService.postFile('PRIVATE', metadataObj, this.fileToUpload)
      .subscribe( () => this.gotoListView(),
        err => {
          if (err.status === 401) {
            this.sessionService.clearSession();
            return;
          }
          this.error = err;
        }
      );
  }

  gotoListView() {
    console.log('let go to  list view');
    this.windowService.locationAssign('/list');
  }

  cancelUpload() {
    this.gotoListView();
  }
}
