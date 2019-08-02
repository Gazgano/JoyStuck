import { createAction, props } from '@ngrx/store';

import { Post } from '../models/post.model';

export const loadPosts = createAction('[Home] Load Posts');
export const loadPostsSuccess = createAction('[Home] Posts loaded successfully', props<{ posts: Post[] }>());
