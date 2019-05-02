import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { UserService } from './user.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private userService: UserService, private router: Router) {}

  canLoad() {
    if (this.userService.isAuthenticated.pipe(take(1))) {
      return true;
    } else {
      console.log('Not logged in. Access denied.');
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
