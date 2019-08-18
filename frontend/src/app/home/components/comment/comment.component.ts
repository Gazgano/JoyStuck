import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments/comments.actions';

const log = new Logger('CommentComponent');

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  @Input() comment: UserComment;
  @Input() palette: string;
  @Input() postId: number;

  constructor(private store: Store<UserComment[]>) { }

  likeComment(id: number) {
    this.store.dispatch(commentsActions.likeComment({ id }));
  }
}
