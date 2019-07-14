import { Action, createReducer, on } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import * as userListActions from './user-list.actions';
import { copyArrayAndDeleteFrom } from '@app/shared/utilities';

export interface State {
  users: User[];
  loadingUsersId: number[];
}

export const initialState: State = {
  users: [],
  loadingUsersId: []
};

const userListReducer = createReducer(
  initialState,
  
  on(userListActions.loadUserListSuccess, (state: State, props) => {
    const users = props.users;
    const loadingUsersId = [...state.loadingUsersId];
    return { users, loadingUsersId };
  }),
  
  on(userListActions.deleteUser, (state: State, props) => {
    return { 
      users: [...state.users],
      loadingUsersId:  state.loadingUsersId.includes(props.user.id)? [...state.loadingUsersId] : [...state.loadingUsersId, props.user.id]
    };
  }),
  
  on(userListActions.deleteUserSuccess, (state: State, props) => {
    const users = copyArrayAndDeleteFrom(state.users, u => u.id === props.user.id);
    const loadingUsersId = copyArrayAndDeleteFrom(state.loadingUsersId, id => id === props.user.id);
    
    return { users, loadingUsersId };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return userListReducer(state, action);
}
