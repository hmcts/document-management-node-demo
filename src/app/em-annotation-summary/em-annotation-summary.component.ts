import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-em-annotation-summary',
  templateUrl: './em-annotation-summary.component.html',
  styleUrls: ['./em-annotation-summary.component.scss']
})
export class EmAnnotationSummaryComponent implements OnInit {

  @Input() url: string;
  
  constructor() { }

  ngOnInit() {
  }

}
