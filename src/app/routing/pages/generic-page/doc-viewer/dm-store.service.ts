import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DmStoreService {

    constructor(private readonly http: HttpClient) {

    }

    getDocumentUrl() {
        return this.http.get('/api/dm-store/document');
    }

}
