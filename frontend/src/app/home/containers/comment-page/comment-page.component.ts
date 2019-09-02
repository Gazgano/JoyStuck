import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { UserComment } from '@app/home/models/user-comment.model';
import * as commentsSelectors from '@app/home/store/comments/comments.selectors';
import * as commentsActions from '@app/home/store/comments/comments.actions';

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.scss']
})
export class CommentPageComponent implements OnInit {

  @Input() postId: string;
  @Input() palette: string;
  @ViewChild('userComment', { static: true }) userCommentInput: ElementRef;
  public isCommentSending$: Observable<boolean>;
  public areCommentsLoading$: Observable<boolean>;
  public comments$: Observable<UserComment[]>;

  constructor(private store: Store<UserComment[]>, private actions$: Actions) { }

  ngOnInit() {
    this.areCommentsLoading$ = this.store.pipe(select(commentsSelectors.selectLoadingCommentsByPostId(this.postId)));
    this.comments$ = this.store.pipe(select(commentsSelectors.selectCommentsByPostId(this.postId)));
    this.isCommentSending$ = this.store.pipe(select(commentsSelectors.selectSendingCommentsByPostId(this.postId)));
  }

  sendComment(text: string) {
    if (text.trim().length > 0) {
      this.store.dispatch(commentsActions.sendComment({ text, postId: this.postId }));
      this.userCommentInput.nativeElement.value = '';
    }
  }
}
