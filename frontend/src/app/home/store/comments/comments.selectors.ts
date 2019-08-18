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

export const selectCommentsByPostId = (postId: number) => createSelector(
  selectCommentsArray,
  comments => comments.filter(c => c.post_id === postId)
);

export const selectCommentsCountByPostId = (postId: number) => createSelector(
  selectCommentsArray,
  comments => comments.filter(c => c.post_id === postId).length
);

export const selectLoadingCommentsByPostId = (postId: number) => createSelector(
  selectComments,
  (state: CommentsState) => state.loadingCommentsPostsIds.includes(postId)
);

export const selectSendingCommentsByPostId = (postId: number) => createSelector(
  selectComments,
  (state: CommentsState) => state.sendingCommentPostsIds.includes(postId)
);
