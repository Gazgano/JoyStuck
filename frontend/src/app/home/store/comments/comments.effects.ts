import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as commentsActions from './comments.actions';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '@app/core/services/auth.service';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('CommentsEffects');

@Injectable()
export class CommentsEffects {
  constructor(private actions$: Actions, private commentsService: CommentsService, private authService: AuthService) {}

  loadComments$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.loadComments),
    mergeMap(action => this.commentsService.getCommentsByPostId(action.postId).pipe(
      map(comments => commentsActions.loadCommentsSuccess({ postId: action.postId, comments })),
      catchError(() => of(commentsActions.loadCommentsFailure({ postId: action.postId })))
    ))
  ));

  likeComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.likeComment),
    mergeMap(action => this.commentsService.likeComment(action.id).pipe(
      map(comment => commentsActions.likeCommentSuccess({ comment })),
      catchError(() => EMPTY)
    ))
  ));

  sendComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.sendComment),
    mergeMap(action => {
      const commentPayload = this.createComment(action.text, action.postId);
      return this.commentsService.postComment(commentPayload).pipe(
        map(comment => commentsActions.sendCommentSuccess({ comment })),
        catchError(err => of(commentsActions.sendCommentFailure({ commentPayload })))
      );
    })
  ));

  private createComment(text: string, postId: string) {
    let authorName: string;
    this.authService.currentUser.subscribe(user => authorName = user.username);

    return { post_id: postId, authorName, content: text };
  }
}
