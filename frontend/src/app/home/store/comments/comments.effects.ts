import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, exhaustMap, switchMap } from 'rxjs/operators';

import * as commentsActions from './comments.actions';
import { CommentsService } from '../../services/comments.service';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('CommentsEffects');

@Injectable()
export class CommentsEffects {
  constructor(
    private actions$: Actions,
    private commentsService: CommentsService,
  ) { }

  ////////////////////////////////////////
  // Effects
  ////////////////////////////////////////

  loadComments$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.loadComments),
    mergeMap(action => this.commentsService.getCommentsByPostId(action.postId).pipe(
      map(comments => commentsActions.loadCommentsSuccess({ postId: action.postId, comments })),
      catchError(error => of(commentsActions.loadCommentsFailure({ postId: action.postId, error })))
    ))
  ));

  likeComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.likeComment),
    switchMap(action => this.commentsService.likeComment(action.comment.id).pipe(
      map(comment => commentsActions.likeCommentSuccess()),
      catchError(err => of(commentsActions.likeCommentFailure({ comment: action.comment, currentUserId: action.currentUserId })))
    ))
  ));

  unlikeComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.unlikeComment),
    switchMap(action => this.commentsService.unlikeComment(action.comment.id).pipe(
      map(comment => commentsActions.unlikeCommentSuccess()),
      catchError(err => of(commentsActions.unlikeCommentFailure({ comment: action.comment, currentUserId: action.currentUserId })))
    ))
  ));

  sendComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.sendComment),
    mergeMap(action => {
      return this.commentsService.postComment(action.pendingComment).pipe(
        map(comment => commentsActions.sendCommentSuccess({ pendingComment: action.pendingComment, comment })),
        catchError(err => of(commentsActions.sendCommentFailure({ failedCommentId: action.pendingComment.id })))
      );
    })
  ));

  retrySendComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.retrySendComment),
    exhaustMap(action => {
      return this.commentsService.postComment(action.failedComment).pipe(
        map(comment => commentsActions.retrySendCommentSuccess({ failedComment: action.failedComment, comment })),
        catchError(err => of(commentsActions.retrySendCommentFailure({failedCommentId: action.failedComment.id})))
      );
    })
  ));
  
  deleteComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.deleteComment),
    mergeMap(action => {
      return this.commentsService.deleteComment(action.comment.id).pipe(
        map(() => commentsActions.deleteCommentSuccess({ comment: action.comment })),
        catchError(error => of(commentsActions.deleteCommentFailure({ error, comment: action.comment })))
      );
    })
  ));
}
