import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { PostState, postReducer } from './post/post.reducer';
import { CommentsState, commentsReducer } from './comments/comments.reducer';

export interface HomeState {
  post: PostState;
  comments: CommentsState;
}

export const reducersMap: ActionReducerMap<HomeState> = {
  post: postReducer,
  comments: commentsReducer
};

export const selectHomeFeature = createFeatureSelector<HomeState>('home');
