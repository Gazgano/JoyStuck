import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as moment from 'moment';

import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from './comments.actions';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('CommentsReducer');

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface CommentsState extends EntityState<UserComment> {
  loadingCommentsPostsIds: string[];
  sendingCommentPostsIds: string[];
  resendingCommentsIds: string[];
}

export const commentsAdapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id,
  sortComparer: (c1: UserComment, c2: UserComment) => moment(c1.timestamp).diff(moment(c2.timestamp))
});

const initialState: CommentsState = commentsAdapter.getInitialState({
  loadingCommentsPostsIds: [],
  sendingCommentPostsIds: [],
  resendingCommentsIds: []
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function onLoadComments(state: CommentsState, props: any) {
  return {...state, loadingCommentsPostsIds: [...state.loadingCommentsPostsIds, props.postId]};
}

function onLoadCommentsSuccess(state: CommentsState, props: any) {
  const loadingCommentsPostsIds = state.loadingCommentsPostsIds.filter(e => e !== props.postId);
  return commentsAdapter.addMany(props.comments, {...state, loadingCommentsPostsIds});
}

function onLoadCommentsFailure(state: CommentsState, props: any) {
  const loadingCommentsPostsIds = state.loadingCommentsPostsIds.filter(e => e !== props.postId);
  return {...state, loadingCommentsPostsIds};
}

function addLike(state: CommentsState, props: any) {
  const likeIds = props.comment.likeIds.includes(props.currentUserId)? 
    props.comment.likeIds: 
    [...props.comment.likeIds, props.currentUserId];

  const update: Update<UserComment> = {
    id: props.comment.id,
    changes: { likeIds }
  };
  return commentsAdapter.updateOne(update, state);
}

function removeLike(state: CommentsState, props: any) {
  const likeIds = props.comment.likeIds.includes(props.currentUserId)? 
    props.comment.likeIds.filter((e: string) => e !== props.currentUserId): 
    props.comment.likeIds;
  
  const update: Update<UserComment> = {
    id: props.comment.id,
    changes: { likeIds }
  };
  return commentsAdapter.updateOne(update, state);
}

function onSendComment(state: CommentsState, props: any) {
  return {...state, sendingCommentPostsIds: [...state.sendingCommentPostsIds, props.postId]};
}

function onSendCommentSuccess(state: CommentsState, props: any) {
  const sendingCommentPostsIds = state.sendingCommentPostsIds.filter(id => id !== props.comment.post_id);
  return commentsAdapter.addOne(props.comment, {...state, sendingCommentPostsIds});
}

function onSendCommentFailure(state: CommentsState, props: any) {
  const sendingCommentPostsIds = state.sendingCommentPostsIds.filter(id => id !== props.failedComment.post_id);
  return commentsAdapter.addOne(props.failedComment, {...state, sendingCommentPostsIds});
}

function onRetrySendComment(state: CommentsState, props: any) {
  return {...state, resendingCommentsIds: [...state.resendingCommentsIds, props.failedComment.id]};
}

function onRetrySendCommentSuccess(state: CommentsState, props: any) {
  let newState = commentsAdapter.removeOne(props.failedComment.id, state);
  newState = commentsAdapter.addOne(props.comment, newState);
  newState.resendingCommentsIds = state.resendingCommentsIds.filter(id => id !== props.failedComment.id);
  return newState;
}

function onRetrySendCommentFailure(state: CommentsState, props: any) {
  const resendingCommentsIds = state.resendingCommentsIds.filter(id => id !== props.failedComment.id);
  return {...state, resendingCommentsIds};
}

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,
  on(commentsActions.loadComments, (state, props) => onLoadComments(state, props)),
  on(commentsActions.loadCommentsSuccess, (state, props) => onLoadCommentsSuccess(state, props)),
  on(commentsActions.loadCommentsFailure, (state, props) => onLoadCommentsFailure(state, props)),
  on(commentsActions.likeComment, (state, props) => addLike(state, props)),
  on(commentsActions.likeCommentFailure, (state, props) => removeLike(state, props)),
  on(commentsActions.unlikeComment, (state, props) => removeLike(state, props)),
  on(commentsActions.unlikeCommentFailure, (state, props) => addLike(state, props)),
  on(commentsActions.sendComment, (state, props) => onSendComment(state, props)),
  on(commentsActions.sendCommentSuccess, (state, props) => onSendCommentSuccess(state, props)),
  on(commentsActions.sendCommentFailure, (state, props) => onSendCommentFailure(state, props)),
  on(commentsActions.retrySendComment, (state, props) => onRetrySendComment(state, props)),
  on(commentsActions.retrySendCommentSuccess, (state, props) => onRetrySendCommentSuccess(state, props)),
  on(commentsActions.retrySendCommentFailure, (state, props) => onRetrySendCommentFailure(state, props))
);

export function commentsReducer(state: CommentsState, action: Action) {
  return reducer(state, action);
}
