import { createSelector } from '@ngrx/store';

import { HomeState, selectHomeFeature } from '../';
import { commentsAdapter, CommentsState } from './comments.reducer';

const selectComments = createSelector(
  selectHomeFeature,
  (state: HomeState) => state.comments
);

const selectCommentsArray = createSelector(
  selectComments,
  commentsAdapter.getSelectors().selectAll,
);

export const selectCommentsByPostId = (postId: string) => createSelector(
  selectCommentsArray,
  comments => comments.filter(c => c.post_id === postId)
);

export const selectCommentsCountByPostId = (postId: string) => createSelector(
  selectCommentsArray,
  comments => comments.filter(c => c.post_id === postId).length
);

export const selectCallState = (postId: string) => createSelector(
  selectComments,
  (state: CommentsState) => state.statesByPostId[postId]
);
