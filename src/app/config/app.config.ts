import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfig {

  private config: Config;

  constructor(private http: HttpClient) {}

  public load(): Promise<void> {
    console.log('Loading app config...');

    const configUrl = environment.configUrl;

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(configUrl)
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

  public getDmStoreAppUrl(): string {
    return this.config.dm_store_app_url;
  }
  public getDmStoreAppLocalUrl(): string {
    return this.config.dm_store_app_local_endpoint;
  }

  public getEmAnnoAppUrl(): string {
    return this.config.em_anno_app_url;
  }
  public getEmAnnoAppLocalUrl(): string {
    return this.config.em_anno_app_local_endpoint;
  }

  public getEmRedactAppUrl(): string {
    return this.config.em_redact_app_url;
  }
  public getEmRedactAppLocalUrl(): string {
    return this.config.em_redact_app_local_endpoint;
  }


  public getDmStoreUploadUrl(): string {
    return this.config.dm_upload_url;
  }
  public getDmStoreSearchCreatorUrl(): string {
    return this.config.dm_find_documents_by_creator_url;
  }
  public getDmStoreSearchMetadataUrl(): string {
    return this.config.dm_find_documents_by_metadata_url;
  }

  public getLoginUrl(): string {
    return this.config.login_url;
  }


}

export class Config {
  login_url: string;

  dm_store_app_url: string;
  dm_store_app_local_endpoint: string;

  em_anno_app_url: string;
  em_anno_app_local_endpoint: string;

  em_redact_app_url: string;
  em_redact_app_local_endpoint: string;

  dm_upload_url: string;
  dm_find_documents_by_creator_url: string;
  dm_find_documents_by_metadata_url: string;
}

