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

export const selectIsLoading = createSelector(
  selectPost,
  (state: PostState) => state.isLoading
);

export const selectLikesCount = (postId: string) => createSelector(
  selectPostsEntities,
  posts => posts[postId].likesCount || 0
);
