import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { AnnotationService } from '../annotation.service';

declare var PDFAnnotate: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnChanges {

  @Input() pdfPages;
  @Input() RENDER_OPTIONS;
  @ViewChild("highlightTool") highlightTool: ElementRef;
  @ViewChild("pointerTool") pointerPool: ElementRef;

  @Input() tool: string;
  @Output() toolChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private annotationService: AnnotationService,) {
  }

  ngOnInit() {
    this.handlePointerClick()
  }

  ngOnChanges() {
    if (this.tool == 'cursor') {
      PDFAnnotate.UI.disableRect();
      PDFAnnotate.UI.enableEdit();
      localStorage.setItem(this.RENDER_OPTIONS.documentId + '/tooltype', 'cursor');
    } else {
      localStorage.setItem(this.RENDER_OPTIONS.documentId + '/tooltype', 'highlight');
      PDFAnnotate.UI.enableRect('highlight');
      PDFAnnotate.UI.disableEdit();
    }
  }

  handleClearAnnotations() {
    if (confirm('Are you sure you want to clear annotations?')) {
      for (let i = 0; i < this.pdfPages; i++) {
        document.querySelector('div#pageContainer' + (i + 1) + ' svg.annotationLayer').innerHTML = '';
      }
      localStorage.removeItem(this.RENDER_OPTIONS.documentId + '/annotations');
      
    }
  }

  handleHighlightClick() {
    this.tool = 'highlight';
    this.toolChange.emit(this.tool);
  }

  handlePointerClick() {
    this.tool = 'cursor';
    this.toolChange.emit(this.tool);
  }
}
