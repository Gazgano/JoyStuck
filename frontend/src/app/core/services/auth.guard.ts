import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private userService: UserService, private router: Router) {}
  
  canLoad() {
    if (this.userService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
