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
  on(userListActions.loadedSuccessUserLists, (state, props) => { 
    return { users: props.users };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return userListReducer(state, action);
}
