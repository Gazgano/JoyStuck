import { createAction, props } from '@ngrx/store';

import { User } from '@app/core/models/user.model';

export const loadUserList = createAction('[Admin] Load UserLists');
export const loadUserListSuccess = createAction('[Admin] UserLists loaded successfully', props<{ users: User[] }>());
export const deleteUser = createAction('[Admin] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[Admin] User deleted successfully', props<{ id: string }>());
