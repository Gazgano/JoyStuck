import { createAction, props } from '@ngrx/store';
import { UserComment } from '../../models/user-comment.model';

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

export const sendComment = createAction(
  '[Home] Send Comment',
  props<{ text: string, postId: string }>()
);

export const sendCommentSuccess = createAction(
  '[Home] Comment sent successfully',
  props<{ comment: UserComment }>()
);

export const sendCommentFailure = createAction(
  '[Home] Send Comment failed',
  props<{ failedComment: UserComment }>()
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
  props<{ failedComment: UserComment }>()
);
