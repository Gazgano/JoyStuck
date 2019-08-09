import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { HomeState, homeReducer } from './home/home.reducer';
import { CommentsState, commentsReducer } from './comments/comments.reducer';

export interface State {
  home: HomeState;
  comments: CommentsState;
}

export const reducersMap: ActionReducerMap<State> = {
  home: homeReducer,
  comments: commentsReducer
};

export const selectHomeFeature = createFeatureSelector<State>('home');
