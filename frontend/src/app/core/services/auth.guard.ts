import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { UserService } from '@app/core/services/user.service';

const log = new Logger('AuthGuard');

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
          log.info('Not logged in. Access denied.');
          this.router.navigateByUrl('login');
        }
      })
    );
  }
}
