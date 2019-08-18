import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments/comments.actions';
import * as commentsSelectors from '../../store/comments/comments.selectors';

const log = new Logger('Comments Component');

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() comments: UserComment[];
  @Input() palette: string;
  @Input() postId: number;
  @ViewChild('userComment') userCommentInput: ElementRef;

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

  likeComment(id: number) {
    this.store.dispatch(commentsActions.likeComment({ id }));
  }

  trackByComment(index: number, comment: UserComment) {
    return comment.id;
  }
}
