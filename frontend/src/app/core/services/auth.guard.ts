import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private userService: UserService, private router: Router) {}
  
  canLoad() {
    if (this.userService.getAuthenticationState()) {
      return true;
    } else {
      console.log('Not logged in. Access denied.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
