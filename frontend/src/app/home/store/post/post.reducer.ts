import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as moment from 'moment';

import { Post } from '../../models/post.model';
import * as postActions from './post.actions';
import { CallState, LoadingState, ErrorState } from '@app/core/models/call-state.model';
import { Logger } from '@app/core/services/logger.service';
import { FirebaseUser } from '@app/home/models/firebase-user.model';

const log = new Logger('PostReducer');

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface PostState extends EntityState<Post> {
  loadPostsState: CallState;
  sendPostState: CallState;
  deletePostsStates: { [postId: string]: CallState };
}

export const postAdapter = createEntityAdapter({
  selectId: (p: Post) => p.id,
  sortComparer: (p1: Post, p2: Post) => moment(p2.timestamp).diff(moment(p1.timestamp))
});

const initialState = postAdapter.getInitialState({
  loadPostsState: null,
  sendPostState: null,
  deletePostsStates: {}
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function addLike(state: PostState, props: any) {
  let likes = props.post.likes || [];

  if (!likes.some(l => l.uid === props.currentUser.id)) {
    likes = [
      ...likes,
      { uid: props.currentUser.id, displayName: props.currentUser.username, photoURL: props.currentUser.profileImageSrcUrl }
    ]
  }

  const update: Update<Post> = {
    id: props.post.id,
    changes: { likes }
  };
  return postAdapter.updateOne(update, state);
}

function removeLike(state: PostState, props: any) {
  let likes = props.post.likes || [];
  likes = likes.filter((l: FirebaseUser) => l.uid !== props.currentUser.id);

  const update: Update<Post> = {
    id: props.post.id,
    changes: { likes }
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
  on(postActions.loadPostsSuccess, (state, props) => postAdapter.addAll(props.posts, {...state, loadPostsState: LoadingState.LOADED })),
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

  // delete post
  on(postActions.deletePost, (state, props) => {
    const deletePostsStates = { ...state.deletePostsStates };
    deletePostsStates[props.post.id] = LoadingState.LOADING;
    return { ...state, deletePostsStates };
  }),
  on(postActions.deletePostSuccess, (state, props) => {
    const deletePostsStates = { ...state.deletePostsStates };
    deletePostsStates[props.post.id] = LoadingState.LOADED;
    return postAdapter.removeOne(props.post.id, { ...state, deletePostsStates });
  }),
  on(postActions.deletePostFailure, (state, props) => {
    const deletePostsStates = { ...state.deletePostsStates };
    deletePostsStates[props.post.id] = { errorMessage: props.error.message };
    return { ...state, deletePostsStates };
  })
);

export function postReducer(state: PostState | undefined, action: Action) {
  return reducer(state, action);
}
