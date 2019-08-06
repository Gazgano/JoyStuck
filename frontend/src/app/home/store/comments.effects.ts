import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as commentsActions from './comments.actions';
import { CommentsService } from '../services/comments.service';
import { EMPTY } from 'rxjs';

@Injectable()
export class CommentsEffects {
  constructor(private actions$: Actions, private commentsService: CommentsService) {}

  loadComments$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.loadComments),
    switchMap(action => this.commentsService.getCommentsByPostId(action.postId).pipe(
      map(comments => commentsActions.loadCommentsSuccess({ comments })),
      catchError(() => EMPTY)
    ))
  ));

  likeComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.likeComment),
    switchMap(action => this.commentsService.likeComment(action.id).pipe(
      map(comment => commentsActions.likeCommentSuccess({ comment })),
      catchError(() => EMPTY)
    ))
  ));
}
