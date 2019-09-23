import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import { User } from '@app/core/models/user.model';
import * as commentsActions from '../../store/comments/comments.actions';
import * as commentsSelectors from '../../store/comments/comments.selectors';
import * as moment from 'moment';
import { AuthService } from '@app/core/services/auth.service';

const log = new Logger('CommentComponent');

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: UserComment;
  @Input() palette: string;
  @Input() postId: string;

  public isResending$: Observable<boolean>;
  public author: User;
  public timestamp: string;
  public currentUser: User;

  constructor(private store: Store<UserComment[]>, private authService: AuthService) { }

  ngOnInit() {
    this.isResending$ = this.store.pipe(select(commentsSelectors.isResending(this.comment.id)));
    this.author = {
      id: this.comment.author.uid,
      username: this.comment.author.displayName,
      profileImageSrcUrl: this.comment.author.photoURL
    };
    this.timestamp = moment(this.comment.timestamp).format('D MMM HH:mm');
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleLikeComment() {
    if (this.comment.likeIds && this.comment.likeIds.includes(this.currentUser.id)) {
      this.store.dispatch(commentsActions.unlikeComment({ comment: this.comment, currentUserId: this.currentUser.id }));
    } else {
      this.store.dispatch(commentsActions.likeComment({ comment: this.comment, currentUserId: this.currentUser.id }));
    }
  }

  retrySend() {
    this.store.dispatch(commentsActions.retrySendComment({ failedComment: this.comment }));
  }
}
