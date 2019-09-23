import { createAction, props } from '@ngrx/store';

import { Post } from '../../models/post.model';

export const loadPosts = createAction('[Home] Load Posts');
export const loadPostsSuccess = createAction('[Home] Posts loaded successfully', props<{ posts: Post[] }>());
export const loadPostsFailure = createAction('[Home] Load Posts failed');

export const likePost = createAction('[Home] Like Post', props<{ post: Post, currentUserId: string }>());
export const likePostSuccess = createAction('[Home] Post liked successfully', props<{ post: Post }>());
export const likePostFailure = createAction('[Home] Like Post failed', props<{ post: Post, currentUserId: string }>());

export const unlikePost = createAction('[Home] Unlike Post', props<{ post: Post, currentUserId: string }>());
export const unlikePostSuccess = createAction('[Home] Post unliked successfully', props<{ post: Post }>());
export const unlikePostFailure = createAction('[Home] Unlike Post failed', props<{ post: Post, currentUserId: string }>());
