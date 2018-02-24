import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppConfig {

  public static readonly CONFIG_PATH = '/assets/config.json';

  private config: Config;

  constructor(private http: HttpClient) {}

  public load(): Promise<void> {
    console.log('Loading app config...');

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(AppConfig.CONFIG_PATH)
        .subscribe((config: Config) => {
          this.config = config;
          console.log('Loading app config: OK');
          resolve();
        }, error => {
          console.error('Configuration file "config.json" could not be read');
          reject();
          return Observable.throw(error.json().error || 'Server error');
        });
    });
  }

  public getLoginUrl(): string {
    return this.config.login_url;
  }

  public getDmGwUrl(): string {
    return this.config.dm_gw_url;
  }
  public getDmUploadUrl(): string {
    return this.config.dm_upload_url;
  }
  public getDmFindByCreatorUrl(): string {
    return this.config.dm_find_documents_by_creator_url;
  }

  public getDmFindByMetadatUrl(): string {
    return this.config.dm_find_documents_by_metadata_url;
  }
  public getEmViewerUrl(): string {
    return this.config.em_viewer_url;
  }
}

export class Config {
  login_url: string;
  dm_gw_url: string;
  dm_upload_url: string;
  em_viewer_url: string;
  dm_find_documents_by_creator_url: string;
  dm_find_documents_by_metadata_url: string;
}
