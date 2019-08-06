import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action, createSelector, createFeatureSelector } from '@ngrx/store';

import { UserComment } from '../models/user-comment.model';
import * as commentsActions from './comments.actions';
import { State } from '.';
import { Logger } from '@app/core/services/logger.service'
import { copyArrayAndDeleteFrom } from '@app/shared/utilities';

const log = new Logger('CommentsReducer');

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface CommentsState extends EntityState<UserComment> {
  loadingCommentsPostsIds: number[];
  sendingCommentPostsIds: number[];
}

const adapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id
});

const initialState: CommentsState = adapter.getInitialState({
  loadingCommentsPostsIds: [],
  sendingCommentPostsIds: []
});

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const commentsReducer = createReducer(
  initialState,

  on(commentsActions.loadComments, (state, props) => {
    return {...state, loadingCommentsPostsIds: [...state.loadingCommentsPostsIds, props.postId]};
  }),

  on(commentsActions.loadCommentsSuccess, (state, { comments }) => {
    // we are copying loadingCommentsPostsIds and removing all ids also in comments
    const loadingCommentsPostsIds = [...state.loadingCommentsPostsIds.filter(e => !comments.map(c => c.post_id).includes(e))];
    return adapter.addMany(comments, {...state, loadingCommentsPostsIds});
  }),

  on(commentsActions.likeCommentSuccess, (state, { comment }) => {
    const update: Update<UserComment> = {
      id: comment.id,
      changes: {
        likesCount: comment.likesCount
      }
    };
    return adapter.updateOne(update, state);
  }),

  on(commentsActions.sendComment, (state, props) => {
    return {...state, sendingCommentPostsIds: [...state.sendingCommentPostsIds, props.postId]};
  }),

  on(commentsActions.sendCommentSuccess, (state, { comment }) => {
    // we are copying sendingCommentPostsIds and removing the id of the successfully posted comment
    const sendingCommentPostsIds = copyArrayAndDeleteFrom(state.sendingCommentPostsIds, e => e === comment.post_id);
    return adapter.addOne(comment, {...state, sendingCommentPostsIds});
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

export const selectLoadingPostIds = createSelector(
  selectComments,
  (state: CommentsState) => state.loadingCommentsPostsIds
);

export const selectSendingPostIds = createSelector(
  selectComments,
  (state: CommentsState) => state.sendingCommentPostsIds
);
