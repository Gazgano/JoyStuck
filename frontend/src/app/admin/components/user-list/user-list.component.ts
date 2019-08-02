import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import * as userListActions from '../../store/user-list.actions';
import { selectUsersArray, selectLoadingUsersIds } from '../../store/user-list.reducer';
import { buttonConfirmationTrigger } from './user-list.animation';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [buttonConfirmationTrigger]
})
export class UserListComponent implements OnInit {
  public users$: Observable<User[]>;
  public loadingUsers$: Observable<number[]>;

  public deletionConfirmation: number;

  constructor(private store: Store<User[]>) { }

  ngOnInit() {
    this.users$ = this.store.pipe(select(selectUsersArray));
    this.loadingUsers$ = this.store.pipe(select(selectLoadingUsersIds));
    this.store.dispatch(userListActions.loadUserList());
  }

  deleteUser(id: number) {
    if (this.deletionConfirmation === id) {
      this.store.dispatch(userListActions.deleteUser({ id }));
    } else {
      this.deletionConfirmation = id;
    }
  }
}
