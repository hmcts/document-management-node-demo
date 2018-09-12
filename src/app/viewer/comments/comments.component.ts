import { Component, OnInit, Input, OnChanges, ViewChild, Renderer2, ElementRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AnnotationService } from '../annotation.service';

declare var PDFAnnotate: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: []
})
export class CommentsComponent implements OnInit, OnChanges {

  @Input() RENDER_OPTIONS: { documentId: string, pdfDocument: any, scale: any, rotate: number };	  
  comments: any;
  commentFormActive: boolean;
  annotationId: string;
  @Input() pageNumber: number;
  
  @ViewChild("commentList") commentList: ElementRef;
  @ViewChild("commentForm") commentForm: ElementRef;
  @ViewChild("commentText") commentText: ElementRef;
//   @ViewChild("commentPlaceholder") commentPlaceholder: ElementRef;

  	constructor(
		private annotationService: AnnotationService,
		private render: Renderer2, 
		private ref: ChangeDetectorRef) { }

  	ngOnInit() {
		this.commentFormActive = false;
		this.comments = []; 
		this.showAllComments();
	};

	ngAfterViewInit() {
		PDFAnnotate.UI.addEventListener('annotation:click', this.handleAnnotationClick.bind(this));
		PDFAnnotate.UI.addEventListener('annotation:blur', this.handleAnnotationBlur.bind(this));
	}

	ngOnChanges(changes: SimpleChanges) {
	}

	showAllComments() {
		this.comments = [];
		// this.render.setProperty(this.commentPlaceholder.nativeElement, 'innerHTML', 'Show all comments for page ' + this.pageNumber);
		var self = this;
		this.annotationService.getAnnotations(
			this.RENDER_OPTIONS,
			this.pageNumber,
			function(pageData) {
				pageData.annotations.forEach(function(annotation) {
					self.readComments(annotation.uuid);
				});
				self.ref.detectChanges();
			}.bind(self)
		)
	}

	handleAnnotationBlur(target) {
		
		if (this.supportsComments(target)) {
			// this.render.setProperty(this.commentList.nativeElement, 'innerHTML', '');
			// this.render.setStyle(this.commentForm.nativeElement, 'display', 'none');
			// this.commentList.innerHTML = '';
			// this.commentForm.style.display = 'none';
			this.render.setProperty(this.commentForm, 'onSubmit', null);
			// this.commentForm.onsubmit = null;
			this.showAllComments();
			this.addHighlightedCommentStyle(null);
			// this.insertComment({ content: 'No comments' }, null);
		}
	}

	supportsComments(target) {
		var type = target.getAttribute('data-pdf-annotate-type');
		return ['point', 'highlight', 'area'].indexOf(type) > -1;
	}

	readComments(annotationId) {
		this.annotationService.getComments(
			this.RENDER_OPTIONS,
			annotationId, 
			function(comments) {
				comments.forEach(element => {
					this.comments.push(element);
				});
				this.ref.detectChanges();
			}.bind(this)
		);
	}

	handleAnnotationClick(event) {
		if (this.supportsComments(event)) {
			this.comments = [];
			this.commentFormActive = true;
			var documentId = this.render.parentNode(event).getAttribute('data-pdf-annotate-document');
			// var documentId = event.parentNode.getAttribute('data-pdf-annotate-document');
			this.annotationId = event.getAttribute('data-pdf-annotate-id');

			// this.render.setProperty(this.commentPlaceholder.nativeElement, 'innerHTML', 'Show annotation comments');
			this.addHighlightedCommentStyle(this.annotationId);
			this.readComments(this.annotationId);
		}
	}

	onSubmit(commentForm: NgForm) {
		this.annotationService.addComment(
			this.RENDER_OPTIONS,
			this.annotationId, 
			commentForm.value.content, 
			setTimeout(this.readComments(this.annotationId)));

		commentForm.reset()
	}

	handleEditComment() {
		alert("did something");
	}

	handleDeleteComment() {
		alert("did something");
	}

	handleCommentClick (event) {
		this.removeCommentSelectedStyle();
		if(this.isNodeComment(event.target)){

			const linkedAnnotationId = event.target.getAttribute('data-linked-annotation');
			this.render.addClass(event.target, "comment-selected");
			this.addHighlightedCommentStyle(linkedAnnotationId);

		}else if(this.isNodeComment(event.target.parentNode)){

			const linkedAnnotationId = event.target.parentNode.getAttribute('data-linked-annotation');
			this.render.addClass(event.target.parentNode, "comment-selected");
			this.addHighlightedCommentStyle(linkedAnnotationId);
		}
	}

	removeCommentSelectedStyle() {
		var listItems = Array.from(document.querySelectorAll('#comment-wrapper .comment-list-item'));
		listItems.forEach(item => {
			this.render.removeClass(item, "comment-selected")
		});
	}

	isNodeComment(node) {
		var linkedAnnotationId = node.getAttribute('data-linked-annotation');
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
