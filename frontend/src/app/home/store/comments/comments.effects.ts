import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError, exhaustMap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import * as uid from 'uid';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as commentsActions from './comments.actions';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '@app/core/services/auth.service';
import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '@app/home/models/user-comment.model';

const log = new Logger('CommentsEffects');

@Injectable()
export class CommentsEffects {
  constructor(
    private actions$: Actions, 
    private commentsService: CommentsService, 
    private authService: AuthService,
    private matSnackBar: MatSnackBar
  ) {}

  loadComments$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.loadComments),
    mergeMap(action => this.commentsService.getCommentsByPostId(action.postId).pipe(
      map(comments => commentsActions.loadCommentsSuccess({ postId: action.postId, comments })),
      catchError(() => of(commentsActions.loadCommentsFailure({ postId: action.postId })))
    ))
  ));

  likeComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.likeComment),
    switchMap(action => this.commentsService.likeComment(action.comment.id).pipe(
      map(comment => commentsActions.likeCommentSuccess()),
      catchError(err => {
        this.matSnackBar.open('An error happened while liking the comment', 'Dismiss', { duration: 3000 });
        log.handleError(err);
        return of(commentsActions.likeCommentFailure({ comment: action.comment, currentUserId: action.currentUserId }));
      })
    ))
  ));

  sendComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.sendComment),
    mergeMap(action => {
      const commentPayload = this.createComment(action.text, action.postId);
      return this.commentsService.postComment(commentPayload).pipe(
        map(comment => commentsActions.sendCommentSuccess({ comment })),
        catchError(err => of(commentsActions.sendCommentFailure({
          failedComment: this.createFailedComment(action.text, action.postId)
        })))
      );
    })
  ));

  retrySendComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.retrySendComment),
    exhaustMap(action => {
      const commentPayload = this.createComment(action.failedComment.content, action.failedComment.post_id);
      return this.commentsService.postComment(commentPayload).pipe(
        map(comment => commentsActions.retrySendCommentSuccess({ failedComment: action.failedComment, comment })),
        catchError(err => of(commentsActions.retrySendCommentFailure({
          failedComment: action.failedComment
        })))
      );
    })
  ));

  private createComment(text: string, postId: string) {
    return {
      post_id: postId,
      author_id: this.authService.getCurrentUser().id,
      content: text
    };
  }

  private createFailedComment(text: string, postId: string): UserComment {
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
      sentFailed: true
    };
  }
}
