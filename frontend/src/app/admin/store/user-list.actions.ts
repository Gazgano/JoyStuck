import { createAction, props } from '@ngrx/store';

import { User } from '@app/core/models/user.model';

export const loadUserList = createAction('[UserList] Load UserLists');
export const loadedSuccessUserLists = createAction('[UserList] UserLists Loaded Success', props<{ users: User[] }>());
