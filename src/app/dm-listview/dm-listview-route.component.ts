import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dm-listview-route',
  template: `
    <app-dm-listview></app-dm-listview>
    <a class="button" href="/upload" role="button">Upload</a>
  `
})
export class DmListViewRouteComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {});
  }
}
