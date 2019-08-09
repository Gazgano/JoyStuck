import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import * as homeActions from './home.actions';
import { PostsService } from '../../services/posts.service';

@Injectable()
export class HomeEffects {
  
  constructor(private actions$: Actions, private postsService: PostsService) { }

  loadPosts$ = createEffect(() => this.actions$.pipe(
    ofType(homeActions.loadPosts),
    switchMap(() => this.postsService.getPosts().pipe(
      map(posts => homeActions.loadPostsSuccess({ posts })),
      catchError(() => EMPTY)
    ))
  ));

  likePost$ = createEffect(() => this.actions$.pipe(
    ofType(homeActions.likePost),
    switchMap(action => this.postsService.likePost(action.id).pipe(
      map(post => homeActions.likePostSuccess({ post })),
      catchError(() => EMPTY)
    ))
  ));
}
