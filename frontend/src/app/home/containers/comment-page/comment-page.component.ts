import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as uid from 'uid';
import * as moment from 'moment';

import { UserComment } from '@app/home/models/user-comment.model';
import * as commentsSelectors from '@app/home/store/comments/comments.selectors';
import * as commentsActions from '@app/home/store/comments/comments.actions';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';
import { CallState, getErrorMessage } from '@app/core/models/call-state.model';
import { Palette } from '@app/core/models/palette.model';
import { CommentAction } from '@app/home/components/comment/comment.component';

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.scss']
})
export class CommentPageComponent implements OnInit {

  @Input() postId: string;
  @Input() palette: Palette;
  @Output() retryLoading = new EventEmitter<boolean>();
  @ViewChild('userComment', { static: true }) userCommentInput: ElementRef;

  public callState$: Observable<CallState>;
  public comments$: Observable<UserComment[]>;
  public currentUser: User;

  constructor(private store: Store<UserComment[]>, private authService: AuthService) { }

  ngOnInit() {
    this.callState$ = this.store.pipe(select(commentsSelectors.selectCallState(this.postId)));
    this.comments$ = this.store.pipe(select(commentsSelectors.selectCommentsByPostId(this.postId)));
    this.currentUser = this.authService.getCurrentUser();
  }

  sendComment(text: string) {
    if (text.trim().length > 0) {
      const pendingComment = this.createPendingComment(text, this.postId);
      this.store.dispatch(commentsActions.sendComment({ pendingComment }));
      this.userCommentInput.nativeElement.value = '';
    }
  }

  retryToLoad() {
    this.retryLoading.emit(true);
  }

  onCommentAction(commentAction: CommentAction) {
    switch (commentAction.action) {
      case 'like':
        this.store.dispatch(commentsActions.likeComment({ comment: commentAction.comment, currentUserId: this.currentUser.id }));
        break;
      case 'unlike':
        this.store.dispatch(commentsActions.unlikeComment({ comment: commentAction.comment, currentUserId: this.currentUser.id }));
        break;
      case 'resend':
        this.store.dispatch(commentsActions.retrySendComment({ failedComment: commentAction.comment }));
        break;
      case 'delete':
        this.store.dispatch(commentsActions.deleteComment({ comment: commentAction.comment }));
        break;
    }
  }

  private createPendingComment(text: string, postId: string): UserComment {
    const user = this.authService.getCurrentUser();
    return {
      id: uid(20),
      post_id: postId,
      author: {
        uid: user.id,
        displayName: user.username,
        photoURL: user.profileImageSrcUrl
      },
      timestamp: moment().format(),
      content: text,
      likeIds: [],
      status: 'PENDING'
    };
  }

  getErrorMessage(callState: CallState): string {
    return getErrorMessage(callState);
  }

  trackByComment(index: number, comment: UserComment) {
    return comment.id;
  }
}
