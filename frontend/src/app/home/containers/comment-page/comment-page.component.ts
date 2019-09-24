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

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.scss']
})
export class CommentPageComponent implements OnInit {

  @Input() postId: string;
  @Input() palette: string;
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
}
