import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import * as userListActions from '../../store/user-list.actions';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public userList$: Observable<{ users: User[] }>;
  
  constructor(private store: Store<User[]>) { }

  ngOnInit() {
    this.userList$ = this.store.pipe(select('userList'));
    this.store.dispatch(userListActions.loadUserList());
  }
}
