import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  public currentUser$: Observable<User>;
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
  }

  onSignout(event: boolean) {
    if (event) {
      this.authService.signOut();
    }
  }
}
