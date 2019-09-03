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
}

export const commentsAdapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id,
  sortComparer: (c1: UserComment, c2: UserComment) => moment(c1.timestamp).diff(moment(c2.timestamp))
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
  const loadingCommentsPostsIds = state.loadingCommentsPostsIds.filter(e => e !== props.postId);
  return commentsAdapter.addMany(props.comments, {...state, loadingCommentsPostsIds});
}

function onLoadCommentsFailure(state: CommentsState, props: any) {
  const loadingCommentsPostsIds = state.loadingCommentsPostsIds.filter(e => e !== props.postId);
  return {...state, loadingCommentsPostsIds};
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
  const sendingCommentPostsIds = state.sendingCommentPostsIds.filter(id => id !== props.comment.post_id);
  return commentsAdapter.addOne(props.comment, {...state, sendingCommentPostsIds});
}

function onSendCommentFailure(state: CommentsState, props: any) {
  const sendingCommentPostsIds = state.sendingCommentPostsIds.filter(id => id !== props.commentPayload.post_id);
  return {...state, sendingCommentPostsIds};
}

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const reducer = createReducer(
  initialState,
  on(commentsActions.loadComments, (state, props) => onLoadComments(state, props)),
  on(commentsActions.loadCommentsSuccess, (state, props) => onLoadCommentsSuccess(state, props)),
  on(commentsActions.loadCommentsFailure, (state, props) => onLoadCommentsFailure(state, props)),
  on(commentsActions.likeCommentSuccess, (state, props) => onLikeCommentsSuccess(state, props)),
  on(commentsActions.sendComment, (state, props) => onSendComment(state, props)),
  on(commentsActions.sendCommentSuccess, (state, props) => onSendCommentSuccess(state, props)),
  on(commentsActions.sendCommentFailure, (state, props) => onSendCommentFailure(state, props))
);

export function commentsReducer(state: CommentsState, action: Action) {
  return reducer(state, action);
}
