import { createAction, props } from '@ngrx/store';

import { User } from '@app/core/models/user.model';

export const loadUserList = createAction('[UserList] Load UserLists');
export const loadUserListSuccess = createAction('[UserList] UserLists loaded successfully', props<{ users: User[] }>());
export const deleteUser = createAction('[UserList] Delete User', props<{ id: number }>());
export const deleteUserSuccess = createAction('[UserList] User deleted successfully', props<{ id: number }>());
