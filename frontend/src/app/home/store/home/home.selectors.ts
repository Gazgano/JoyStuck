import { createSelector } from '@ngrx/store';
import { selectHomeFeature, State } from '../';
import { homeAdapter, HomeState } from './home.reducer';

const selectHome = createSelector(
  selectHomeFeature,
  (state: State) => state.home
);

const selectPostsEntities = createSelector(
  selectHome,
  homeAdapter.getSelectors().selectEntities
);

export const selectPostsArray = createSelector(
  selectHome,
  homeAdapter.getSelectors().selectAll
);

export const selectIsLoading = createSelector(
  selectHome,
  (state: HomeState) => state.isLoading
);

export const selectLikesCount = (postId: number) => createSelector(
  selectPostsEntities,
  posts => posts[postId].likesCount || 0
);
