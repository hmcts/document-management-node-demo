import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollEvent } from 'ngx-scroll-event';
import { DOCUMENT } from '@angular/common';

declare var PDFJS: any;
declare var PDFAnnotate: any;

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss']
})

export class ViewerComponent implements OnInit {

	url: string;
	annotate: boolean;
	@Output() documentId: EventEmitter<String> = new EventEmitter<String>();
	RENDER_OPTIONS;
	renderedPages = {};
	UI;
  PAGE_HEIGHT;
  
  @Output() NUM_PAGES: number;
  
  @ViewChild("contentWrapper") contentWrapper: ElementRef;

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: any) {
		this.route.queryParams.subscribe(params => {
			this.url = params.url;
			this.annotate = params.annotate === 'true';
    });
  }

	handlePdfScroll(event: ScrollEvent) {
    const element = event.originalEvent.currentTarget as HTMLInputElement;
		const visiblePageNum = Math.round(element.scrollTop / 1056) + 1; // Hardcoded page height as 1056
    const visiblePage = this.document.querySelector('.page[data-page-number="' + visiblePageNum + '"][data-loaded="false"]');
		if (visiblePage && !this.renderedPages[visiblePageNum]) {
			// Prevent invoking UI.renderPage on the same page more than once.
				this.renderedPages[visiblePageNum] = true;
				PDFAnnotate.UI.renderPage(visiblePageNum, this.RENDER_OPTIONS);			
		}
  }

  ngOnInit() {
    var self = this;
    this.UI = PDFAnnotate.UI;
    var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

		this.documentId.emit('/assets/example.pdf');
		document
    this.PAGE_HEIGHT = void 0;
    this.RENDER_OPTIONS = {
      documentId: '/assets/example.pdf',
      pdfDocument: null,
      scale: parseFloat("1.33"),
      rotate: parseInt(localStorage.getItem('/assets/example.pdf' + '/rotate'), 10) || 0
    };

    PDFAnnotate.setStoreAdapter(new PDFAnnotate.LocalStoreAdapter());
    // PDFJS.disableWorker = true;
    PDFJS.workerSrc = '/assets/shared/pdf.worker.js';
    this.NUM_PAGES = 0;

    function render(RENDER_OPTIONS, UI) {
      PDFJS.getDocument(RENDER_OPTIONS.documentId).then(function (pdf) {
        RENDER_OPTIONS.pdfDocument = pdf;

        var viewer = document.getElementById('viewer');
        viewer.innerHTML = '';
        self.NUM_PAGES = pdf.pdfInfo.numPages;
        for (var i = 0; i < self.NUM_PAGES; i++) {
          var page = UI.createPage(i + 1);
          viewer.appendChild(page);
        }

        UI.renderPage(1, RENDER_OPTIONS).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var pdfPage = _ref2[0];
          var annotations = _ref2[1];

          self.PAGE_HEIGHT = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
        });
      });
    }
    render(this.RENDER_OPTIONS, this.UI);
  }  
}
