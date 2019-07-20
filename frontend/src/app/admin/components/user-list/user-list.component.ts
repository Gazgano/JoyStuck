import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import * as userListActions from '../../store/user-list.actions';
import { UserListState } from '../../store/user-list.reducer';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public userList$: Observable<UserListState>;

  constructor(private store: Store<User[]>) { }

  ngOnInit() {
    this.userList$ = this.store.pipe(select('userList'));
    this.store.dispatch(userListActions.loadUserList());
  }

  deleteUser(user: User) {
    this.store.dispatch(userListActions.deleteUser({ user }));
  }

  isLoading(state: UserListState, user: User): boolean {
    return state.loadingUsersId.includes(user.id);
  }
}
