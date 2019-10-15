import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() currentUser$: Observable<User>;
  @Output() signout = new EventEmitter<boolean>();

  constructor() { }

  logout() {
    this.signout.emit(true);
  }
}
