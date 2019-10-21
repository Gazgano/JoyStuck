import { createSelector } from '@ngrx/store';
import { selectHomeFeature, HomeState } from '..';
import { postAdapter, PostState } from './post.reducer';

const selectPost = createSelector(
  selectHomeFeature,
  (state: HomeState) => state.post
);

const selectPostsEntities = createSelector(
  selectPost,
  postAdapter.getSelectors().selectEntities
);

export const selectPostsArray = createSelector(
  selectPost,
  postAdapter.getSelectors().selectAll
);

export const selectLoadPostsState = createSelector(
  selectPost,
  (state: PostState) => state.loadPostsState
);

export const selectLikeIds = (postId: string) => createSelector(
  selectPostsEntities,
  posts => posts[postId].likeIds || []
);

export const selectSendPostState = createSelector(
  selectPost,
  (state: PostState) => state.sendPostState
);

export const selectDeletePostState = (postId: string) => createSelector(
  selectPost,
  (state: PostState) => state.deletePostsStates[postId] || null
);
