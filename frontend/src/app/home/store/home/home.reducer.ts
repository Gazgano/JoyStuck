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
// Reducer helpers
////////////////////////////////////////////////

function onLikePostSuccess(state: HomeState, props: any) {
  const update: Update<Post> = {
    id: props.post.id,
    changes: {
      likesCount: props.post.likesCount
    }
  };
  return homeAdapter.updateOne(update, state);
}

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,
  
  on(homeActions.loadPosts, state => ({ ...state, isLoading: true })),
  
  on(homeActions.loadPostsSuccess, (state, { posts }) => {
    return homeAdapter.addAll(posts, {...state, isLoading: false});
  }),

  on(homeActions.likePostSuccess, (state, props) => onLikePostSuccess(state, props))
);

export function homeReducer(state: HomeState | undefined, action: Action) {
  return reducer(state, action);
}
