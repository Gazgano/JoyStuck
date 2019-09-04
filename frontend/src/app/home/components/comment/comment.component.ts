import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments/comments.actions';
import * as commentsSelectors from '../../store/comments/comments.selectors';

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

  constructor(private store: Store<UserComment[]>) { }

  ngOnInit() {
    this.isResending$ = this.store.pipe(select(commentsSelectors.isResending(this.comment.id)));
  }
  
  likeComment(id: string) {
    this.store.dispatch(commentsActions.likeComment({ id }));
  }

  retrySend() {
    this.store.dispatch(commentsActions.retrySendComment({ failedComment: this.comment }));
  }
}
