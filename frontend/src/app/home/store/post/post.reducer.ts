import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as moment from 'moment';

import { Post } from '../../models/post.model';
import * as postActions from './post.actions';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface PostState extends EntityState<Post> {
  isLoading: boolean;
  inError: boolean;
}

export const postAdapter = createEntityAdapter({
  selectId: (p: Post) => p.id,
  sortComparer: (p1: Post, p2: Post) => moment(p2.timestamp).diff(moment(p1.timestamp))
});

const initialState = postAdapter.getInitialState({
  isLoading: false,
  inError: false
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function addLike(state: PostState, props: any) {
  const likeIds = props.post.likeIds.includes(props.currentUserId)? 
    props.post.likeIds: 
    [...props.post.likeIds, props.currentUserId];
  
  const update: Update<Post> = {
    id: props.post.id,
    changes: { likeIds }
  };
  return postAdapter.updateOne(update, state);
}

function removeLike(state: PostState, props: any) {
  const likeIds = props.post.likeIds.includes(props.currentUserId)? 
    props.post.likeIds.filter((e: string) => e !== props.currentUserId): 
    props.post.likeIds;
  
  const update: Update<Post> = {
    id: props.post.id,
    changes: { likeIds }
  };
  return postAdapter.updateOne(update, state);
}

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,

  on(postActions.loadPosts, state => ({ ...state, isLoading: true, inError: false })),
  on(postActions.loadPostsSuccess, (state, { posts }) => {
    return postAdapter.addAll(posts, {...state, isLoading: false, inError: false });
  }),
  on(postActions.loadPostsFailure, state => {
    return {...state, isLoading: false, inError: true };
  }),

  on(postActions.likePost, (state, props) => addLike(state, props)),
  on(postActions.likePostFailure, (state, props) => removeLike(state, props)),

  on(postActions.unlikePost, (state, props) => removeLike(state, props)),
  on(postActions.unlikePostFailure, (state, props) => addLike(state, props))
);

export function postReducer(state: PostState | undefined, action: Action) {
  return reducer(state, action);
}
