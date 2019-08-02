import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';

import { Post } from '../models/post.model';
import * as homeActions from './home.actions';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface HomeState extends EntityState<Post> { }

const adapter = createEntityAdapter({
  selectId: (p: Post) => p.id
});

const initialState = adapter.getInitialState();

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const homeReducer = createReducer(
  initialState,
  
  on(homeActions.loadPostsSuccess, (state, { posts }) => {
    return adapter.addAll(posts, state);
  })
);

export function reducer(state: HomeState | undefined, action: Action) {
  return homeReducer(state, action);
}

////////////////////////////////////////////////
// Selector
////////////////////////////////////////////////

const selectHome = createFeatureSelector<HomeState>('home');

export const selectPostsArray = createSelector(
  selectHome,
  adapter.getSelectors().selectAll
);
