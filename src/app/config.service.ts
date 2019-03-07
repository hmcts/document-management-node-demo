import { Inject, Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
declare function require(name: string);
import { config } from '../../config';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    config = null;

    CONFIG_KEY = makeStateKey('config');

    constructor(private state: TransferState, @Inject(DOCUMENT) private document: any) {
        this.config = this.state.get(this.CONFIG_KEY, {
            api_base_url: this.getBaseUrl(config),
            ...config
        });
    }

    getBaseUrl(configData) {
        return `${configData.protocol}://${this.document.location.host}`;
    }
}
