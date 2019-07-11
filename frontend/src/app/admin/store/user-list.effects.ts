import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as userListActions from './user-list.actions';
import { UserService } from '@app/core/services/user.service';

@Injectable()
export class UserListEffects {

  constructor(private actions$: Actions, private userService: UserService) {}

  // when a loadUserList event is dispatched, we get users with an http request (via UserService)
  // on response we dispatch the loadUserListSuccess event, with the usersList in payload
  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(userListActions.loadUserList),
    switchMap(() => this.userService.getUsers().pipe(
      map(users => userListActions.loadUserListSuccess({ users })),
      catchError(() => EMPTY)
    ))
  ));

  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType(userListActions.deleteUser),
    switchMap(action => this.userService.deleteUser(action.user).pipe(
      map(user => userListActions.deleteUserSuccess({ user })),
      catchError(() => EMPTY)
    ))
  ));
}
