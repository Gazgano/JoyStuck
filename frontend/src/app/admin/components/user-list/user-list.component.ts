import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '@app/core/models/user.model';
import { buttonConfirmationTrigger } from './user-list.animation';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [buttonConfirmationTrigger]
})
export class UserListComponent implements OnInit {
  public users$: Observable<User[]>;
  public loadingUsers$: Observable<string[]>;

  public deletionConfirmation: string;

  constructor(private store: Store<User[]>) { }

  ngOnInit() {
  }

  deleteUser(id: string) {
  }

  trackByUser(index: number, user: User) {
    return user.id;
  }
}
