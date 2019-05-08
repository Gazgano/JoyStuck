import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { UserService } from '@app/core/services/user.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private userService: UserService, private router: Router) {}

  canLoad() {
    return this.userService.isAuthenticated.pipe(
      take(1), // to send an onComplete message in the observer. Otherwise, the guard waits for it
      tap(isAuth => {
        if (!isAuth) {
          console.log('Not logged in. Access denied.');
          this.router.navigateByUrl('login');
        }
      })
    );
  }
}
