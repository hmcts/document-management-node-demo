import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class RedirectionService {

    constructor(@Inject(DOCUMENT) private document: any) {

    }

    redirect(url) {
        console.log('Redirecting', url);
        this.document.location.href = url;
    }
}
