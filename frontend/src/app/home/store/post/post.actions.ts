import { createAction, props } from '@ngrx/store';

import { Post } from '../../models/post.model';
import { User } from '@app/core/models/user.model';

export const loadPosts = createAction('[Home] Load Posts');
export const loadPostsSuccess = createAction('[Home] Posts loaded successfully', props<{ posts: Post[] }>());
export const loadPostsFailure = createAction('[Home] Load Posts failed', props<{ error: any }>());

export const likePost = createAction('[Home] Like Post', props<{ post: Post, currentUser: User }>());
export const likePostSuccess = createAction('[Home] Post liked successfully');
export const likePostFailure = createAction('[Home] Like Post failed', props<{ post: Post, currentUser: User }>());

export const unlikePost = createAction('[Home] Unlike Post', props<{ post: Post, currentUser: User }>());
export const unlikePostSuccess = createAction('[Home] Post unliked successfully');
export const unlikePostFailure = createAction('[Home] Unlike Post failed', props<{ post: Post, currentUser: User }>());

export const sendPost = createAction('[Home] Send Post', props<{ pendingPost: Post }>());
export const sendPostSuccess = createAction('[Home] Post sent successfully', props<{ post: Post }>());
export const sendPostFailure = createAction('[Home] Send Post failed', props<{ error: any }>());

export const deletePost = createAction('[Home] Delete Post', props<{ post: Post }>());
export const deletePostSuccess = createAction('[Home] Post deleted successfully', props<{ post: Post }>());
export const deletePostFailure = createAction('[Home] Delete Post failed', props<{ error: any, post: Post }>());
