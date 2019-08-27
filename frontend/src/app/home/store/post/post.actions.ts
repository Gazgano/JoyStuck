import { createAction, props } from '@ngrx/store';

import { Post } from '../../models/post.model';

export const loadPosts = createAction('[Post] Load Posts');
export const loadPostsSuccess = createAction('[Post] Posts loaded successfully', props<{ posts: Post[] }>());
export const likePost = createAction('[Post] Like Post', props<{ id: string }>());
export const likePostSuccess = createAction('[Post] Post liked successfully', props<{ post: Post }>());
