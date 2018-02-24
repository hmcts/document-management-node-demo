import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dm-upload-route',
  template: `
    <app-dm-upload></app-dm-upload>`
})
export class DmUploadRouteComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe();
  }
}

