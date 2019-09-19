import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';

const log = new Logger('AuthGuard');

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad() {
    return this.authService.isAuthenticated.pipe(
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
