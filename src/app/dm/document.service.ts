// import {Injectable} from '@angular/core';
// import {HttpClient, HttpHeaders} from '@angular/common/http';
// import {AppConfig} from '../app.config';
// import {SessionService} from '../auth/session.service';
// import {Observable} from 'rxjs/Observable';
//
// const pageNoteType = 'PAGENOTE';
//
// export class Note {
//   url: string;
//   content: string;
//   page: number;
//
//   constructor(url = '', content: string = '', page: number = 1) {
//     this.url = url;
//     this.content = content;
//     this.page = page;
//   }
//
//   toObject() {
//     return {
//       page: this.page,
//       comments: [{
//         content: this.content
//       }],
//       type: pageNoteType
//     };
//   }
// }
//
// @Injectable()
// export class AnnotationService {
//
//   private documetns: any;
//
//   constructor(private httpClient: HttpClient,
//               private sessionService: SessionService,
//               private appConfig: AppConfig) {
//   }
//
//   getDocuments(url): Promise<Note[]> {
//     return this.lookForAnnotationSets(url).then(possibleSet => {
//       if (possibleSet) {
//         this.annotationSet = possibleSet;
//         return this.extractNotes(possibleSet);
//       }
//       return this.initiateNewSet(url);
//     });
//   }
//
//   getNote(note: Note): Observable<Note> {
//     if (note.url) {
//       return this.httpClient.get(note.url, this.getHttpOptions()).map(this.newNoteFromAnnotation);
//     }
//     note.content = ''; // No URL means it's a new note so just clear the content.
//     return new Observable<Note>(observer => {
//       observer.next(note);
//     });
//   }
//
//   saveNote(note: Note): Observable<any> {
//     if (note.url) {
//       if (note.content) {
//         return this.httpClient.put(note.url, note.toObject(), this.getHttpOptions()).map(resp => note);
//       }
//       return this.httpClient.delete(note.url, this.getHttpOptions()).map(resp => {
//         note.url = '';
//         return note;
//       });
//     }
//     return this.httpClient.post(this.annotationSet._links['add-annotation'].href, note.toObject(), this.getHttpOptions())
//       .map(annotation => this.newNoteFromAnnotation(annotation));
//   }
//
//   private newNoteFromAnnotation(annotation) {
//     return new Note(annotation._links.self.href, annotation.comments[0].content, annotation.page);
//   }
//
//   private lookForAnnotationSets(url: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//       const httpOptions = this.getHttpOptions();
//       const annoUrl = `${this.appConfig.getAnnotationUrl()}/find-all-by-document-url?url=${url}`;
//       this.httpClient.get<any>(annoUrl, httpOptions).subscribe(response => {
//         if (response._embedded && response._embedded.annotationSets && response._embedded.annotationSets.length) {
//           resolve(response._embedded.annotationSets[0]);
//         } else {
//           resolve(null);
//         }
//       }, reject);
//     });
//   }
//
//   private extractNotes(set) {
//     const notes = set.annotations
//       .filter(a => a.type === pageNoteType) // only page notes
//       .sort((a, b) => a.page - b.page) // order by page
//       .map(annotation => {
//         return this.newNoteFromAnnotation(annotation);
//       })
//       .reduce((acc, current) => {
//         acc[current.page - 1] = current;
//         return acc;
//       }, []);
//     return notes;
//   }
//
//   private initiateNewSet(url: string) {
//     return new Promise((resolve, reject) => {
//       const body = {
//         documentUri: url,
//         annotations: [],
//       };
//       const annotationUrl = this.appConfig.getAnnotationUrl();
//       this.httpClient.post(annotationUrl, body, this.getHttpOptions()).subscribe(response => {
//           this.annotationSet = response;
//           resolve(new Array<Note>());
//         },
//         reject);
//     });
//   }
//
//   private getHttpOptions() {
//     return {
//       headers: new HttpHeaders({
//         'Authorization': `Bearer ${this.sessionService.getSession().token}`,
//         'Accept': 'application/json'
//       })
//     };
//   }
//
// }
