import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { UserComment } from '../models/user-comment.model';
import { createReducer, on, Action, createSelector, createFeatureSelector } from '@ngrx/store';
import * as commentsActions from './comments.actions';
import { State } from '.';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface CommentsState extends EntityState<UserComment> { }

const adapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id
});

const initialState: CommentsState = adapter.getInitialState();

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const commentsReducer = createReducer(
  initialState,
  on(commentsActions.loadCommentsSuccess, (state, { comments }) => {
    return adapter.addAll(comments, state);
  })
);

export function reducer(state: CommentsState, action: Action) {
  return commentsReducer(state, action);
}

////////////////////////////////////////////////
// Selector
////////////////////////////////////////////////

const selectHomeFeature = createFeatureSelector<State>('home');

export const selectComments = createSelector(
  selectHomeFeature,
  (state: State) => state.comments
);

export const selectCommentsArray = createSelector(
  selectComments,
  adapter.getSelectors().selectAll
);
