import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';

import { Post } from '../models/post.model';
import * as homeActions from './home.actions';
import { State } from '.';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface HomeState extends EntityState<Post> {
  isLoading: boolean;
}

const adapter = createEntityAdapter({
  selectId: (p: Post) => p.id
});

const initialState = adapter.getInitialState({
  isLoading: false
});

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const homeReducer = createReducer(
  initialState,
  
  on(homeActions.loadPosts, state => {
    return {...state, isLoading: true};
  }),
  
  on(homeActions.loadPostsSuccess, (state, { posts }) => {
    return adapter.addAll(posts, {...state, isLoading: false});
  })
);

export function reducer(state: HomeState | undefined, action: Action) {
  return homeReducer(state, action);
}

////////////////////////////////////////////////
// Selector
////////////////////////////////////////////////

const selectHomeFeature = createFeatureSelector<State>('home');

export const selectHome = createSelector(
  selectHomeFeature,
  (state: State) => state.home
);

export const selectPostsArray = createSelector(
  selectHome,
  adapter.getSelectors().selectAll
);

export const selectIsLoading = createSelector(
  selectHome,
  (state: HomeState) => state.isLoading
);
