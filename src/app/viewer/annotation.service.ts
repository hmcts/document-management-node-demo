import { Injectable, OnInit } from '@angular/core';
import { AnnotationStoreService } from './annotation-store.service';

declare var PDFJS: any;
declare var PDFAnnotate: any;

@Injectable()
export class AnnotationService implements OnInit{
  PAGE_HEIGHT;
  UI;

  constructor(private annotationStoreService: AnnotationStoreService) { 
    PDFAnnotate.setStoreAdapter(new PDFAnnotate.LocalStoreAdapter());

    // PDFJS.disableWorker = true;
    PDFJS.workerSrc = '/assets/shared/pdf.worker.js';
    this.PAGE_HEIGHT = void 0;
    this.UI = PDFAnnotate.UI;
  }

  ngOnInit() {
  }

  render(RENDER_OPTIONS, callback) {
    var self = this;
    PDFJS.getDocument(RENDER_OPTIONS.documentId).then(function (pdf) {
      RENDER_OPTIONS.pdfDocument = pdf;

      const viewer = document.getElementById('viewer');
      viewer.innerHTML = '';
      const NUM_PAGES = pdf.pdfInfo.numPages;
      for (let i = 0; i < NUM_PAGES; i++) {
        const page = self.UI.createPage(i + 1);
        viewer.appendChild(page);
      }
      callback(NUM_PAGES);

      self.UI.renderPage(1, RENDER_OPTIONS).then(function (_ref) {
        var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
        var _ref2 = _slicedToArray(_ref, 2);

        var pdfPage = _ref2[0];
        var annotations = _ref2[1];
        self.PAGE_HEIGHT = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
      });
    });
  }

  renderPage(RENDER_OPTIONS, visiblePageNum: number) {
    PDFAnnotate.UI.renderPage(visiblePageNum, RENDER_OPTIONS);	
  }

  addComment(RENDER_OPTIONS, annotationId: string, content: string, callback ) {
    PDFAnnotate.getStoreAdapter()
		.addComment(RENDER_OPTIONS.documentId, annotationId, content)
		.then(callback);
  }

  getComments(RENDER_OPTIONS, annotationId: string, callback) {
    PDFAnnotate.getStoreAdapter()
    .getComments(RENDER_OPTIONS.documentId, annotationId)
		.then(callback);
  }

  getAnnotations(RENDER_OPTIONS, pageNumber: number, callback) {
    PDFAnnotate.getStoreAdapter()
		.getAnnotations(RENDER_OPTIONS.documentId, pageNumber)
		.then(callback);
  }
}
