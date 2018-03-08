import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-em-viewer-route',
  template: `
    <app-em-viewer *ngIf="url" [url]="url" [annotate]="annotate"></app-em-viewer>
  `
})
export class EmViewerRouteComponent implements OnInit {
  url: string;
  annotate: boolean;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.url = params.url;
        this.annotate = params.annotate === 'true';
      });
  }
}

