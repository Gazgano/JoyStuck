import { Action, createReducer, on } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import { loadUserLists } from './user-list.actions';


export interface State {
  users: User[];
}

export const initialState: State = {
  users: []
};

const userListReducer = createReducer(
  initialState,
  on(loadUserLists, state => ({ users: [
    {
        id: 1,
        username: 'admin',
        profileImageSrcUrl: 'http://localhost:8080/api/users/1/profileImage'
    },
    {
        id: 2,
        username: 'Gazgano',
        profileImageSrcUrl: 'http://localhost:8080/api/users/2/profileImage'
    }
] }))
);

export function reducer(state: State | undefined, action: Action) {
  return userListReducer(state, action);
}
