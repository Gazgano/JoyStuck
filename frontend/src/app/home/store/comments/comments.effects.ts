import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect, Effect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import * as moment from 'moment';

import * as commentsActions from './comments.actions';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserComment } from '../../models/user-comment.model';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('CommentsEffects');

@Injectable()
export class CommentsEffects {
  constructor(private actions$: Actions, private commentsService: CommentsService, private authService: AuthService) {}

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

  sendComment$ = createEffect(() => this.actions$.pipe(
    ofType(commentsActions.sendComment),
    switchMap(action => this.commentsService.postComment(this.createComment(action.text, action.postId)).pipe(
      map(comment => commentsActions.sendCommentSuccess({ comment })),
      catchError(() => EMPTY)
    ))
  ));

  private createComment(text: string, postId: number): UserComment {
    let authorName: string;
    this.authService.currentUser.subscribe(user => authorName = user.username);

    const comment: UserComment = {
      id: null,
      post_id: postId,
      authorName,
      timestamp: moment(),
      content: text,
      likesCount: 0
    };

    return comment;
  }
}
