import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import { Post } from '../../models/post.model';
import * as postActions from './post.actions';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface PostState extends EntityState<Post> {
  isLoading: boolean;
}

export const postAdapter = createEntityAdapter({
  selectId: (p: Post) => p.id
});

const initialState = postAdapter.getInitialState({
  isLoading: false
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function onLikePostSuccess(state: PostState, props: any) {
  const update: Update<Post> = {
    id: props.post.id,
    changes: {
      likesCount: props.post.likesCount
    }
  };
  return postAdapter.updateOne(update, state);
}

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,

  on(postActions.loadPosts, state => ({ ...state, isLoading: true })),

  on(postActions.loadPostsSuccess, (state, { posts }) => {
    return postAdapter.addAll(posts, {...state, isLoading: false});
  }),

  on(postActions.likePostSuccess, (state, props) => onLikePostSuccess(state, props))
);

export function postReducer(state: PostState | undefined, action: Action) {
  return reducer(state, action);
}
