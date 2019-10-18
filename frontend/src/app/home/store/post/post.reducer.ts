import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as moment from 'moment';

import { Post } from '../../models/post.model';
import * as postActions from './post.actions';
import { CallState, LoadingState, ErrorState } from '@app/core/models/call-state.model';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface PostState extends EntityState<Post> {
  loadPostsState: CallState;
  sendPostState: CallState;
}

export const postAdapter = createEntityAdapter({
  selectId: (p: Post) => p.id,
  sortComparer: (p1: Post, p2: Post) => moment(p2.timestamp).diff(moment(p1.timestamp))
});

const initialState = postAdapter.getInitialState({
  loadPostsState: null,
  sendPostState: null
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function addLike(state: PostState, props: any) {
  let likeIds = props.post.likeIds || [];
  likeIds = likeIds.includes(props.currentUserId)? 
    props.post.likeIds: 
    [...props.post.likeIds, props.currentUserId];
  
  const update: Update<Post> = {
    id: props.post.id,
    changes: { likeIds }
  };
  return postAdapter.updateOne(update, state);
}

function removeLike(state: PostState, props: any) {
  let likeIds = props.post.likeIds || [];
  likeIds = likeIds.includes(props.currentUserId)? 
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

  // load posts
  on(postActions.loadPosts, state => ({ ...state, loadPostsState: LoadingState.LOADING })),
  on(postActions.loadPostsSuccess, (state, props) => {
    return postAdapter.addAll(props.posts, {...state, loadPostsState: LoadingState.LOADED });
  }),
  on(postActions.loadPostsFailure, (state, props) => {
    const errorState: ErrorState = { errorMessage: props.error.message };
    return { ...state, loadPostsState: errorState };
  }),

  // like post
  on(postActions.likePost, (state, props) => addLike(state, props)),
  on(postActions.likePostFailure, (state, props) => removeLike(state, props)),

  // unlike post
  on(postActions.unlikePost, (state, props) => removeLike(state, props)),
  on(postActions.unlikePostFailure, (state, props) => addLike(state, props)),

  // publish post
  on(postActions.sendPost, state => ({ ...state, sendPostState: LoadingState.LOADING })),
  on(postActions.sendPostSuccess, (state, props) => {
    return postAdapter.addOne(props.post, {...state, sendPostState: LoadingState.LOADED });
  }),
  on(postActions.sendPostFailure, (state, props) => {
    const errorState: ErrorState = { errorMessage: props.error.message };
    return { ...state, sendPostState: errorState };
  }),
);

export function postReducer(state: PostState | undefined, action: Action) {
  return reducer(state, action);
}
