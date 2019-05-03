import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private userService: UserService, private router: Router) {}

  canLoad() {
    let canLoad: boolean;
    this.userService.isAuthenticated.subscribe(b => canLoad = b);
    
    if(!canLoad) {
      console.log('Not logged in. Access denied.');
      this.router.navigateByUrl('login');
    }
    
    return canLoad;
  }
}
