import { Component, OnInit, Input, OnChanges, ViewChild, Renderer2, ElementRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { AnnotationService } from '../annotation.service';

declare const PDFAnnotate: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: []
})
export class CommentsComponent implements OnInit, OnChanges {  
  comments: any;
  commentFormActive: boolean;
  annotationId: string;
  selectedAnnotationId: string;
  authorId:string;
  @Input() pageNumber: number;
  
  @ViewChild("commentList") commentList: ElementRef;
  @ViewChild("commentForm") commentForm: ElementRef;
  @ViewChild("commentText") commentText: ElementRef;

  	constructor(
		private annotationService: AnnotationService,
		private render: Renderer2, 
		private ref: ChangeDetectorRef) { }

  	ngOnInit() {
		  this.authorId = "testAuthor";
		this.commentFormActive = false;
		this.comments = []; 
	};

	ngAfterViewInit() {
		PDFAnnotate.UI.addEventListener('annotation:click', this.handleAnnotationClick.bind(this));
		PDFAnnotate.UI.addEventListener('annotation:blur', this.handleAnnotationBlur.bind(this));
	}

	ngOnChanges(changes: SimpleChanges) {
		this.showAllComments()
	}

	showAllComments() {
		this.comments = [];
		var self = this;
		this.annotationService.getAnnotations(
			this.pageNumber,
			pageData => {
			// function(pageData) {
				pageData.annotations.forEach(function(annotation) {
					self.readComments(annotation.uuid);
				});
				this.ref.detectChanges();
			// }.bind(self)
			}
		);
	}

	handleAnnotationBlur(target) {
		if (this.supportsComments(target)) {
			this.selectedAnnotationId = null;
			this.showAllComments();
			this.addHighlightedCommentStyle(null);
		}
	}

	supportsComments(target) {
		var type = target.getAttribute('data-pdf-annotate-type');
		return ['point', 'highlight', 'area'].indexOf(type) > -1;
	}

	readComments(annotationId) {
		this.comments = [];
		this.annotationService.getComments(
			annotationId, 
			comments => {
				comments.forEach(element => {
					if(element !== undefined) {
						element.createdDate = new Date();
						element.author = this.authorId;
						this.comments.push(element);	
					}
				});
				this.ref.detectChanges();
			}
		);
	}

	handleAnnotationClick(event) {
		if (this.supportsComments(event)) {
			this.comments = [];
			this.commentFormActive = true;
			// var documentId = this.render.parentNode(event).getAttribute('data-pdf-annotate-document');
			this.annotationId = event.getAttribute('data-pdf-annotate-id');
			this.selectedAnnotationId = event.getAttribute('data-pdf-annotate-id');
			this.addHighlightedCommentStyle(this.annotationId);
			this.readComments(this.annotationId);
		}
	}

	isNodeComment(node) {
		const linkedAnnotationId = node.getAttribute('data-linked-annotation');
		if (linkedAnnotationId) {
			return true;
		}
		return false;
	}

	addHighlightedCommentStyle(linkedAnnotationId) {
		const annotations = Array.from(document.querySelector('#pageContainer1 .annotationLayer').childNodes);

		annotations.forEach(annotation => {
			this.render.removeClass(annotation,"comment-selected");
			const annotationId = (<HTMLInputElement>annotation).dataset.pdfAnnotateId;

			if (annotationId === linkedAnnotationId) {
				this.render.addClass(annotation, "comment-selected");
			}
		})
	}
}
