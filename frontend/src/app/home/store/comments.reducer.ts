import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { UserComment } from '../models/user-comment.model';
import { createReducer, on, Action, createSelector, createFeatureSelector } from '@ngrx/store';
import * as commentsActions from './comments.actions';
import { State } from '.';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface CommentsState extends EntityState<UserComment> {
  loadingPostsIds: number[];
}

const adapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id
});

const initialState: CommentsState = adapter.getInitialState({
  loadingPostsIds: []
});

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const commentsReducer = createReducer(
  initialState,

  on(commentsActions.loadComments, (state, props) => {
    return {...state, loadingPostsIds: [...state.loadingPostsIds, props.postId]};
  }),

  on(commentsActions.loadCommentsSuccess, (state, { comments }) => {
    // we are copying loadingPostsIds and remove all ids also in comments
    const loadingPostsIds = [...state.loadingPostsIds.filter(e => !comments.map(c => c.post_id).includes(e))];
    return adapter.addMany(comments, {...state, loadingPostsIds});
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

export const selectLoadingIds = createSelector(
  selectComments,
  (state: CommentsState) => state.loadingPostsIds
);
