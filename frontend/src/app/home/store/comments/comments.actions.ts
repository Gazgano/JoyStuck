import { createAction, props } from '@ngrx/store';
import { UserComment } from '../../models/user-comment.model';

////////////////////////////////////////
// Load comments
////////////////////////////////////////

export const loadComments = createAction(
  '[Home] Load Comments',
  props<{ postId: string }>()
);

export const loadCommentsSuccess = createAction(
  '[Home] Comments loaded successfully',
  props<{ postId: string, comments: UserComment[] }>()
);

export const loadCommentsFailure = createAction(
  '[Home] Load Comments failed',
  props<{ postId: string }>()
);

////////////////////////////////////////
// Like/Unlike comments
////////////////////////////////////////

export const likeComment = createAction(
  '[Home] Like Comment',
  props<{ comment: UserComment, currentUserId: string }>()
);

export const likeCommentSuccess = createAction(
  '[Home] Comment liked successfully'
);

export const likeCommentFailure = createAction(
  '[Home] Like Comment failed',
  props<{ comment: UserComment, currentUserId: string }>()
);

export const unlikeComment = createAction(
  '[Home] Unlike Comment',
  props<{ comment: UserComment, currentUserId: string }>()
);

export const unlikeCommentSuccess = createAction(
  '[Home] Comment unliked successfully'
);

export const unlikeCommentFailure = createAction(
  '[Home] Unlike Comment failed',
  props<{ comment: UserComment, currentUserId: string }>()
);

////////////////////////////////////////
// Send comments
////////////////////////////////////////

export const sendComment = createAction(
  '[Home] Send Comment',
  props<{ pendingComment: UserComment }>()
);

export const sendCommentSuccess = createAction(
  '[Home] Comment sent successfully',
  props<{ pendingComment: UserComment, comment: UserComment }>()
);

export const sendCommentFailure = createAction(
  '[Home] Send Comment failed',
  props<{ failedCommentId: string }>()
);

export const retrySendComment = createAction(
  '[Home] Retry to send Comment',
  props<{ failedComment: UserComment }>()
);

export const retrySendCommentSuccess = createAction(
  '[Home] Sent retry done successfully',
  props<{ failedComment: UserComment, comment: UserComment }>()
);

export const retrySendCommentFailure = createAction(
  '[Home] Sent retry failed',
  props<{ failedCommentId: string }>()
);
