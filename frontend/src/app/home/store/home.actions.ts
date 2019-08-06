import { createAction, props } from '@ngrx/store';

import { Post } from '../models/post.model';

export const loadPosts = createAction('[Home] Load Posts');
export const loadPostsSuccess = createAction('[Home] Posts loaded successfully', props<{ posts: Post[] }>());
export const likePost = createAction('[Home] Like Post', props<{ id: number }>());
export const likePostSuccess = createAction('[Home] Post liked successfully', props<{ post: Post }>());
