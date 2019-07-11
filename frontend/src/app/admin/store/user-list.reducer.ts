import { Action, createReducer, on } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import * as userListActions from './user-list.actions';


export interface State {
  users: User[];
}

export const initialState: State = {
  users: []
};

const userListReducer = createReducer(
  initialState,
  on(userListActions.loadUserListSuccess, (state, props) => {
    return { users: props.users };
  }),
  on(userListActions.deleteUserSuccess, (state, props) => {
    const index = state.users.findIndex(u => u.id === props.user.id);
    const result = [...state.users];
    result.splice(index, 1);
    return { users: result };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return userListReducer(state, action);
}
