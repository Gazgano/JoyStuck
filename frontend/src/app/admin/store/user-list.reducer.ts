import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import { EntityState, Update, createEntityAdapter } from '@ngrx/entity';

import { User } from '@app/core/models/user.model';
import * as userListActions from './user-list.actions';
import { copyArrayAndDeleteFrom } from '@app/shared/utilities';

////////////////////////////////////////////////
// State
////////////////////////////////////////////////

export interface UserListState extends EntityState<User> {
  loadingUsersId: string[];
}

const adapter = createEntityAdapter({
  selectId: (u: User) => u.id,
  sortComparer: (u1: User, u2: User) => u1.username.localeCompare(u2.username)
});

const initialState = adapter.getInitialState({
  loadingUsersId: []
});

////////////////////////////////////////////////
// Reducer
////////////////////////////////////////////////

const userListReducer = createReducer(
  initialState,

  on(userListActions.loadUserListSuccess, (state, { users }) => {
    return adapter.addAll(users, state);
  }),

  on(userListActions.deleteUser, (state, { id }) => {
    const result =  {...state};
    result.loadingUsersId = state.loadingUsersId.includes(id)?
        [...state.loadingUsersId] : [...state.loadingUsersId, id];
    return result;
  }),

  on(userListActions.deleteUserSuccess, (state, { id }) => {
    const result = adapter.removeOne(id, state);
    result.loadingUsersId = copyArrayAndDeleteFrom(state.loadingUsersId, e => e === id);
    return result;
  })
);

export function reducer(state: UserListState | undefined, action: Action) {
  return userListReducer(state, action);
}

////////////////////////////////////////////////
// Selector
////////////////////////////////////////////////

const selectUserList = createFeatureSelector<UserListState>('userList');

export const selectUsersArray = createSelector(
  selectUserList,
  adapter.getSelectors().selectAll
);

export const selectLoadingUsersIds = createSelector(
  selectUserList,
  (state: UserListState) => state.loadingUsersId
);
