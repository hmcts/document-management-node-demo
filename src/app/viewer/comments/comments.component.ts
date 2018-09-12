import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { ViewerComponent } from '../viewer.component';
import { NgForm } from '@angular/forms';

declare var PDFJS: any;
declare var PDFAnnotate: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() viewerComponent: ViewerComponent;

  constructor() { }

  RENDER_OPTIONS;
  comments: any;
  commentFormActive: boolean;
  annotationId: string;
  pageNumber: number;
  
  @ViewChild("commentList") commentList;
  @ViewChild("commentForm") commentForm;
  @ViewChild("commentText") commentText;

  ngOnInit() {
	this.commentFormActive = false;
	this.comments = []; 
	var self = this;
	this.pageNumber = 1;
	this.RENDER_OPTIONS = {
		documentId: '/assets/example.pdf',
		pdfDocument: null,
		scale: parseFloat("1.33"),
		rotate: parseInt(localStorage.getItem('/assets/example.pdf' + '/rotate'), 10) || 0
	};

    var PAGE_HEIGHT = void 0;
  
    // Comment stuff
	loadComments(document);
	function loadComments (document) {

		document.querySelector('#content-wrapper').addEventListener('click', function(event) {
			self.pageNumber = getClickedPage(event);
			showAllComments();
		});

		function getClickedPage(event) {
			var currentParent = event.target;
			for (var step = 0; step < 5; step++) {
				var pageNumber = currentParent.parentNode.getAttribute('data-page-number');
				if (pageNumber != null) {
					break;
				};
				currentParent = currentParent.parentNode;
			}
			return pageNumber;
		}
		
		// var lastKnownPage = 1;
		// document.getElementById('content-wrapper').addEventListener('scroll', function () {
		// 	let element = event.currentTarget as HTMLInputElement;
		// 	var visiblePageNum = Math.round(element.scrollTop / PAGE_HEIGHT - (PAGE_HEIGHT/3000)) + 1;
		// 	if (lastKnownPage != visiblePageNum) {
		// 		lastKnownPage = visiblePageNum;
		// 		showAllComments(visiblePageNum);
		// 	}
		// });

		function showAllComments() {
			// document.querySelector('#comment-header').innerHTML= "Page " + pageNumber;
			self.commentList.innerHTML = '';
		
			PDFAnnotate.getStoreAdapter()
			.getAnnotations(self.RENDER_OPTIONS.documentId, self.pageNumber)
			.then(function(pageData) {
				pageData.annotations.forEach(function(annotation) {
					// displayAnnotationComments(annotation.uuid);
					self.readComments(annotation.uuid);
				});
			});
		}
		};
	};

	ngAfterViewInit() {
		PDFAnnotate.UI.addEventListener('annotation:click', this.handleAnnotationClick.bind(this));
		PDFAnnotate.UI.addEventListener('annotation:blur', this.handleAnnotationBlur.bind(this));
	}

	handleAnnotationBlur(target) {
		if (this.supportsComments(target)) {
			this.commentList.innerHTML = '';
			// this.commentForm.style.display = 'none';
			this.commentForm.onsubmit = null;
			
			this.addHighlightedCommentStyle(null);
			// this.insertComment({ content: 'No comments' }, null);
		}
	}

	supportsComments(target) {
		var type = target.getAttribute('data-pdf-annotate-type');
		return ['point', 'highlight', 'area'].indexOf(type) > -1;
	}

	readComments(annotationId) {
		var self = this;
		
		PDFAnnotate.getStoreAdapter().getComments(self.RENDER_OPTIONS.documentId, annotationId)
		.then(function (comments) {
			self.commentList.innerHTML = '';
			self.comments = comments;
		});
	}

	handleAnnotationClick(event) {
		if (this.supportsComments(event)) {
			this.commentFormActive = true;
			var documentId = event.parentNode.getAttribute('data-pdf-annotate-document');
			this.annotationId = event.getAttribute('data-pdf-annotate-id');
			this.addHighlightedCommentStyle(this.annotationId);

			this.readComments(this.annotationId);
			console.log(this.comments);

		}else{
			this.commentFormActive = false;
		}
	}

	onSubmit(commentForm: NgForm) {
		var self = this;
		PDFAnnotate.getStoreAdapter()
		.addComment(this.RENDER_OPTIONS.documentId, this.annotationId, commentForm.value)
		//.then(this.insertComment)
		.then(function () {
			console.log(self);
			self.commentText.value = '';
			// self.commentText.focus();
		});

		return false;
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

			var linkedAnnotationId = event.target.getAttribute('data-linked-annotation');
			event.target.classList.add("comment-selected");
			this.addHighlightedCommentStyle(linkedAnnotationId);

		}else if(this.isNodeComment(event.target.parentNode)){

			var linkedAnnotationId = event.target.parentNode.getAttribute('data-linked-annotation');
			event.target.parentNode.classList.add("comment-selected");
			this.addHighlightedCommentStyle(linkedAnnotationId);
		}
	}

	removeCommentSelectedStyle() {
		var listItems = Array.from(document.querySelector('#comment-wrapper .comment-list-container').childNodes);
		listItems.forEach(function(item) {
			// item.classList.remove("comment-selected");
			(<HTMLInputElement>item).classList.remove("comment-selected");
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
		var annotations = Array.from(document.querySelector('#pageContainer1 .annotationLayer').childNodes);

		annotations.forEach(function(annotation) {
			// annotation.classList.remove("comment-selected");
			(<HTMLInputElement>annotation).classList.remove("comment-selected");
			var annotationId = (<HTMLInputElement>annotation).dataset.pdfAnnotateId;

			if (annotationId === linkedAnnotationId) {
				(<HTMLInputElement>annotation).classList.add("comment-selected");
			}
		})
	}
}
