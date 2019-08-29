import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as postActions from './post.actions';
import { PostsService } from '../../services/posts.service';

@Injectable()
export class PostEffects {

  constructor(private actions$: Actions, private postsService: PostsService) { }

  loadPosts$ = createEffect(() => this.actions$.pipe(
    ofType(postActions.loadPosts),
    switchMap(() => this.postsService.getPosts().pipe(
      map(posts => postActions.loadPostsSuccess({ posts })),
      catchError(() => of(postActions.loadPostsFailure()))
    ))
  ));

  likePost$ = createEffect(() => this.actions$.pipe(
    ofType(postActions.likePost),
    switchMap(action => this.postsService.likePost(action.id).pipe(
      map(post => postActions.likePostSuccess({ post })),
      catchError(() => EMPTY)
    ))
  ));
}
