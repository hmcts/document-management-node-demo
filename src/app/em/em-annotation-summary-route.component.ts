import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-em-annotation-summary-route',
  template: `
    <app-em-annotation-summary *ngIf="url" [url]="url" ></app-em-annotation-summary>
  `
})
export class EmAnnotationSummaryRouteComponent implements OnInit {
  url: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.url = params.url;
      });
  }
}

