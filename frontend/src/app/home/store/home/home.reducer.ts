import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import { Post } from '../../models/post.model';
import * as homeActions from './home.actions';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface HomeState extends EntityState<Post> {
  isLoading: boolean;
}

export const homeAdapter = createEntityAdapter({
  selectId: (p: Post) => p.id
});

const initialState = homeAdapter.getInitialState({
  isLoading: false
});

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,
  
  on(homeActions.loadPosts, state => {
    return {...state, isLoading: true};
  }),
  
  on(homeActions.loadPostsSuccess, (state, { posts }) => {
    return homeAdapter.addAll(posts, {...state, isLoading: false});
  }),

  on(homeActions.likePostSuccess, (state, { post }) => {
    const update: Update<Post> = {
      id: post.id,
      changes: {
        likesCount: post.likesCount
      }
    };
    return homeAdapter.updateOne(update, state);
  }),
);

export function homeReducer(state: HomeState | undefined, action: Action) {
  return reducer(state, action);
}
