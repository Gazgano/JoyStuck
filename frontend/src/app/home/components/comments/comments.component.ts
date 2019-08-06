import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments.actions';

const log = new Logger('Comments Component');

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  @Input() comments: UserComment[];
  @Input() palette: string;
  @Input() postId: number;
  @ViewChild('userComment') userCommentInput: ElementRef;
  public sendCommentLoading = false;

  constructor(private store: Store<UserComment[]>) { }

  sendComment(text: string) {
    // if (text.trim().length > 0) {
    //   this.sendCommentLoading = true;

    //   this.postService.postComment(text, this.postId).subscribe(comment => {
    //     log.debug(comment);

    //     if (comment) {
    //       this.comments.push(comment);
    //       this.userCommentInput.nativeElement.value = '';
    //     }

    //     this.sendCommentLoading = false;
    //   });
    // }
  }

  likeComment(id: number) {
    this.store.dispatch(commentsActions.likeComment({ id }));
  }
}
