import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as postActions from './post.actions';
import { PostsService } from '../../services/posts.service';

@Injectable()
export class PostEffects {

  constructor(private actions$: Actions, private postsService: PostsService) { }

  loadPosts$ = createEffect(() => this.actions$.pipe(
    ofType(postActions.loadPosts),
    mergeMap(() => this.postsService.getPosts().pipe(
      map(posts => postActions.loadPostsSuccess({ posts })),
      catchError(() => of(postActions.loadPostsFailure()))
    ))
  ));

  likePost$ = createEffect(() => this.actions$.pipe(
    ofType(postActions.likePost),
    switchMap(action => this.postsService.likePost(action.post.id).pipe(
      map(post => postActions.likePostSuccess({ post })),
      catchError(() => of(postActions.likePostFailure({ post: action.post, currentUserId: action.currentUserId })))
    ))
  ));

  unlikePost$ = createEffect(() => this.actions$.pipe(
    ofType(postActions.unlikePost),
    switchMap(action => this.postsService.unlikePost(action.post.id).pipe(
      map(post => postActions.unlikePostSuccess({ post })),
      catchError(() => of(postActions.unlikePostFailure({ post: action.post, currentUserId: action.currentUserId })))
    ))
  ));
}
