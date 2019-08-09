import { createSelector } from '@ngrx/store';
import { State, selectHomeFeature } from '../';
import { commentsAdapter, CommentsState } from './comments.reducer';

const selectComments = createSelector(
  selectHomeFeature,
  (state: State) => state.comments
);

const selectCommentsArray = createSelector(
  selectComments,
  commentsAdapter.getSelectors().selectAll,
);

export const selectCommentsByPostId = (postId: number) => createSelector(
  selectCommentsArray,
  comments => comments.filter(c => c.post_id === postId)
);

export const selectLoadingCommentsByPostId = (postId: number) => createSelector(
  selectComments,
  (state: CommentsState) => state.loadingCommentsPostsIds.includes(postId)
);

export const selectSendingCommentsByPostId = (postId: number) => createSelector(
  selectComments,
  (state: CommentsState) => state.sendingCommentPostsIds.includes(postId)
);
