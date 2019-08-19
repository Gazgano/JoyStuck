import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { UserComment } from '@app/home/models/user-comment.model';
import * as commentsActions from '../../store/comments/comments.actions';
import * as commentsSelectors from '../../store/comments/comments.selectors';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy {

  @Input() comments: UserComment[];
  @Input() palette: string;
  @Input() postId: number;

  @ViewChild('userComment', { static: true }) userCommentInput: ElementRef;

  public isCommentSending$: Observable<boolean>;
  private destroyed$ = new Subject<boolean>();

  constructor(private store: Store<UserComment[]>, private actions$: Actions) { }

  ngOnInit() {
    this.isCommentSending$ = this.store.pipe(select(commentsSelectors.selectSendingCommentsByPostId(this.postId)));
    this.eraseOnSentCommentSuccess();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  sendComment(text: string) {
    if (text.trim().length > 0) {
      this.store.dispatch(commentsActions.sendComment({ text, postId: this.postId }));
    }
  }

  eraseOnSentCommentSuccess() {
    this.actions$.pipe(
      ofType(commentsActions.sendCommentSuccess),
      takeUntil(this.destroyed$) // we ensure unsubscription on component destruction
    ).subscribe(props => {
      if (props.comment.post_id === this.postId) {
        this.userCommentInput.nativeElement.value = ''; // we erase input field if comment is well sent
      }
    });
  }

  trackByComment(index: number, comment: UserComment) {
    return comment.id;
  }
}
