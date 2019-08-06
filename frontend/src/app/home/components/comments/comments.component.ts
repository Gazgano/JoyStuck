import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments.actions';
import * as fromComments from '../../store/comments.reducer';
import { CommentsEffects } from '@app/home/store/comments.effects';

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

  public sendingCommentPostsIds$ = this.store.pipe(select(fromComments.selectSendingPostIds));

  constructor(private store: Store<UserComment[]>) { }
  
  sendComment(text: string) {
    if (text.trim().length > 0) {
      this.store.dispatch(commentsActions.sendComment({ text, postId: this.postId }));
      
      // this.commentsService.postComment(text, this.postId).subscribe(comment => {
      //   if (comment) {
      //     this.comments.push(comment);
      //     this.userCommentInput.nativeElement.value = '';
      //   }
      // });
    }
  }

  likeComment(id: number) {
    this.store.dispatch(commentsActions.likeComment({ id }));
  }
}
