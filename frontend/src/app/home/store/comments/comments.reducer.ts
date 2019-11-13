import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as moment from 'moment';

import { UserComment, CommentStatus } from '../../models/user-comment.model';
import * as commentsActions from './comments.actions';
import { Logger } from '@app/core/services/logger.service';
import { CallState, LoadingState } from '@app/core/models/call-state.model';
import { FirebaseUser } from '@app/home/models/firebase-user.model';

const log = new Logger('CommentsReducer');

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface CommentsState extends EntityState<UserComment> {
  statesByPostId: { [postId: string]: CallState };
}

export const commentsAdapter = createEntityAdapter({
  selectId: (c: UserComment) => c.id,
  sortComparer: (c1: UserComment, c2: UserComment) => moment(c1.timestamp).diff(moment(c2.timestamp))
});

const initialState: CommentsState = commentsAdapter.getInitialState({
  statesByPostId: {}
});

////////////////////////////////////////////////
// Reducer helpers
////////////////////////////////////////////////

function onLoadComments(state: CommentsState, props: any) {
  const statesByPostId = {...state.statesByPostId};
  statesByPostId[props.postId] = LoadingState.LOADING;
  return { ...state, statesByPostId };
}

function onLoadCommentsSuccess(state: CommentsState, props: any) {
  const statesByPostId = {...state.statesByPostId};
  statesByPostId[props.postId] = LoadingState.LOADED;
  return { ...commentsAdapter.addMany(props.comments, state), statesByPostId };
}

function onLoadCommentsFailure(state: CommentsState, props: any) {
  const statesByPostId = {...state.statesByPostId};
  statesByPostId[props.postId] = { errorMessage: props.error.message };
  return { ...state, statesByPostId };
}

function addComment(state: CommentsState, props: any) {
  return commentsAdapter.addOne(props.pendingComment, state);
}

function addLike(state: CommentsState, props: any) {
  let likes = props.comment.likes || [];

  if (!likes.some(l => l.uid === props.currentUser.id)) {
    likes = [
      ...likes,
      { uid: props.currentUser.id, displayName: props.currentUser.username, photoURL: props.currentUser.profileImageSrcUrl }
    ]
  }

  const update: Update<UserComment> = {
    id: props.comment.id,
    changes: { likes }
  };
  return commentsAdapter.updateOne(update, state);
}

function removeLike(state: CommentsState, props: any) {
  let likes = props.comment.likes || [];
  likes = likes.filter((l: FirebaseUser) => l.uid !== props.currentUser.id);

  const update: Update<UserComment> = {
    id: props.comment.id,
    changes: { likes }
  };
  return commentsAdapter.updateOne(update, state);
}

function updateStatus(state: CommentsState, id: string, newStatus: CommentStatus) {
  const update: Update<UserComment> = {
    id,
    changes: { status: newStatus }
  };
  return commentsAdapter.updateOne(update, state);
}

function replaceComment(state: CommentsState, oldCommentId: string, newComment: UserComment) {
  const newState = commentsAdapter.removeOne(oldCommentId, state);
  return commentsAdapter.addOne(newComment, newState);
}

function removeComment(state: CommentsState, commentId: string) {
  return commentsAdapter.removeOne(commentId, state);
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
  on(commentsActions.sendComment, (state, props) => addComment(state, props)),
  on(commentsActions.sendCommentSuccess, (state, props) => replaceComment(state, props.pendingComment.id, props.comment)),
  on(commentsActions.sendCommentFailure, (state, props) => updateStatus(state, props.failedCommentId, 'FAILED')),
  on(commentsActions.retrySendComment, (state, props) => updateStatus(state, props.failedComment.id, 'PENDING')),
  on(commentsActions.retrySendCommentSuccess, (state, props) => replaceComment(state, props.failedComment.id, props.comment)),
  on(commentsActions.retrySendCommentFailure, (state, props) => updateStatus(state, props.failedCommentId, 'FAILED')),
  on(commentsActions.deleteComment, (state, props) => updateStatus(state, props.comment.id, 'DELETING')),
  on(commentsActions.deleteCommentSuccess, (state, props) => removeComment(state, props.comment.id)),
  on(commentsActions.deleteCommentFailure, (state, props) => updateStatus(state, props.comment.id, 'SENT'))
);

export function commentsReducer(state: CommentsState, action: Action) {
  return reducer(state, action);
}
