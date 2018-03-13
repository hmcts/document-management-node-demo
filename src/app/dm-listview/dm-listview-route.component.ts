import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dm-listview-route',
  template: `
    <app-dm-listview [page]="page" [sortby]="sortby" [order]="order" [size]="size"></app-dm-listview>
    <a class="button" href="/upload" role="button" data-hook="listview__document-upload">Upload</a>
  `
})
export class DmListViewRouteComponent implements OnInit {

  page: number;
  sortby: string;
  order: string;
  size: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.page = params.page || 0;
        // this.page = 0;
        // this.sortby = params.sortby || 'createdOn';
        this.sortby = 'createdOn';
        // this.order = params.order || 'desc';
        this.order = 'desc';
        // this.size = params.size || 5;
        this.size = 5;
      });
  }
}
