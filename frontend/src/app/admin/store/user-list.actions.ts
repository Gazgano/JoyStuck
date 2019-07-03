import { createAction, props } from '@ngrx/store';
import { User } from '@app/core/models/user.model';

export const loadUserLists = createAction(
  '[UserList] Load UserLists',
  props<{ users: User[] }>()
);
