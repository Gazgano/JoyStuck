import { createAction, props } from '@ngrx/store';

import { Post } from '../../models/post.model';

export const loadPosts = createAction('[Home] Load Posts');
export const loadPostsSuccess = createAction('[Home] Posts loaded successfully', props<{ posts: Post[] }>());
export const loadPostsFailure = createAction('[Home] Load Posts failed');
export const likePost = createAction('[Home] Like Home', props<{ id: string }>());
export const likePostSuccess = createAction('[Home] Post liked successfully', props<{ post: Post }>());
