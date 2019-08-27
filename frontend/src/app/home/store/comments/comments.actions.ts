import { createAction, props } from '@ngrx/store';
import { UserComment } from '../../models/user-comment.model';

export const loadComments = createAction('[Comments] Load Comments', props<{ postId: string }>());
export const loadCommentsSuccess = createAction('[Comments] Comments loaded successfully', props<{ comments: UserComment[] }>());
export const likeComment = createAction('[Comments] Like Comment', props<{ id: string }>());
export const likeCommentSuccess = createAction('[Comments] Comment liked successfully', props<{ comment: UserComment }>());
export const sendComment = createAction('[Comments] Send Comment', props<{ text: string, postId: string }>());
export const sendCommentSuccess = createAction('[Comments] Comment sent successfully', props<{ comment: UserComment }>());
