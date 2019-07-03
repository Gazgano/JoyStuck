import { Injectable } from '@angular/core';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { loadUserLists } from './user-list.actions';
import { AdminService } from '../services/admin.service';

@Injectable()
export class UserListEffects {

  constructor(private actions$: Actions, private adminService: AdminService) {}

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(loadUserLists.type)
  ));

  // loadUsers$ = createEffect(() => this.actions$.pipe(
  //   ofType(loadUserLists.type),
  //   mergeMap(() => this.adminService.getUsers()
  //     .pipe(
  //       map(users => ({ type: '[Movies API] Movies Loaded Success', payload: users })),
  //       catchError(() => EMPTY)
  //     ))
  //   )
  // );
}
