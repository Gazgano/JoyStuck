import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { HomeState } from './home.reducer';
import { CommentsState } from './comments.reducer';
import * as fromHome from './home.reducer';
import * as fromComments from './comments.reducer';

export interface State {
  home: HomeState;
  comments: CommentsState;
}

export const reducersMap: ActionReducerMap<State> = {
  home: fromHome.reducer,
  comments: fromComments.reducer
};

export const selectHomeFeature = createFeatureSelector<State>('home');
