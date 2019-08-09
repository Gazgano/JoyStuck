import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from './comments.actions';
import { Logger } from '@app/core/services/logger.service';
import { copyArrayAndDeleteFrom } from '@app/shared/utilities';

const log = new Logger('CommentsReducer');

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface CommentsState extends EntityState<UserComment> {
  loadingCommentsPostsIds: number[];
  sendingCommentPostsIds: number[];
}

export const commentsAdapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id
});

const initialState: CommentsState = commentsAdapter.getInitialState({
  loadingCommentsPostsIds: [],
  sendingCommentPostsIds: []
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function onLoadComments(state: CommentsState, props: any) {
  return {...state, loadingCommentsPostsIds: [...state.loadingCommentsPostsIds, props.postId]};
}

function onLoadCommentsSuccess(state: CommentsState, props: any) {
  // we are copying loadingCommentsPostsIds and removing all ids also in comments
  const loadingCommentsPostsIds = [...state.loadingCommentsPostsIds.filter(e => !props.comments.map(c => c.post_id).includes(e))];
  return commentsAdapter.addMany(props.comments, {...state, loadingCommentsPostsIds});
}

function onLikeCommentsSuccess(state: CommentsState, props: any) {
  const update: Update<UserComment> = {
    id: props.comment.id,
    changes: {
      likesCount: props.comment.likesCount
    }
  };
  return commentsAdapter.updateOne(update, state);
}

function onSendComment(state: CommentsState, props: any) {
  return {...state, sendingCommentPostsIds: [...state.sendingCommentPostsIds, props.postId]};
}

function onSendCommentSuccess(state: CommentsState, props: any) {
  // we are copying sendingCommentPostsIds and removing the id of the successfully posted comment
  const sendingCommentPostsIds = copyArrayAndDeleteFrom(state.sendingCommentPostsIds, e => e === props.comment.post_id);
  return commentsAdapter.addOne(props.comment, {...state, sendingCommentPostsIds});
}

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,
  on(commentsActions.loadComments, (state, props) => onLoadComments(state, props)),
  on(commentsActions.loadCommentsSuccess, (state, props) => onLoadCommentsSuccess(state, props)),
  on(commentsActions.likeCommentSuccess, (state, props) => onLikeCommentsSuccess(state, props)),
  on(commentsActions.sendComment, (state, props) => onSendComment(state, props)),
  on(commentsActions.sendCommentSuccess, (state, props) => onSendCommentSuccess(state, props))
);

export function commentsReducer(state: CommentsState, action: Action) {
  return reducer(state, action);
}
