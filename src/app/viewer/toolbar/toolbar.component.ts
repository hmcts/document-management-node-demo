import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
declare var PDFJS: any;
declare var PDFAnnotate: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() NUM_PAGES;
  @Input() RENDER_OPTIONS;
  @Input() UI;
  @ViewChild("highlightTool") highlightTool: ElementRef;
  @ViewChild("pointerTool") pointerPool: ElementRef;
  tool: string;

  constructor() {
  }

  ngOnInit() {
    this.RENDER_OPTIONS = {
      documentId: '/assets/example.pdf',
      pdfDocument: null,
      scale: parseFloat("1.33"),
      rotate: parseInt(localStorage.getItem('/assets/example.pdf' + '/rotate'), 10) || 0
    };
    var tooltype = localStorage.getItem(this.RENDER_OPTIONS.documentId + '/tooltype') || 'cursor';
  }

  handleClearAnnotations(event) {
    if (confirm('Are you sure you want to clear annotations?')) {
      for (var i = 0; i < this.NUM_PAGES; i++) {
        document.querySelector('div#pageContainer' + (i + 1) + ' svg.annotationLayer').innerHTML = '';
      }
      localStorage.removeItem(this.RENDER_OPTIONS.documentId + '/annotations');
    }
  }

  handleHighlightClick(event) {
    // this.highlightTool.nativeElement.classList.add('button.active');
    PDFAnnotate.UI.disableEdit();
    localStorage.setItem(this.RENDER_OPTIONS.documentId + '/tooltype', 'highlight');
    this.tool = 'highlight';
  }

  handlePointerClick(event) {
    // this.pointerPool.nativeElement.classList.add('button.active');
    PDFAnnotate.UI.enableEdit();
    localStorage.setItem(this.RENDER_OPTIONS.documentId + '/tooltype', 'cursor');
    this.tool = 'cursor';
  }
}
