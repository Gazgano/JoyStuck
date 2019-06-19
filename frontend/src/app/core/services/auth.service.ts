import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

import { ApiService } from '@app/core/services/api.service';
import { JwtService } from '@app/core/services/jwt.service';
import { Logger } from '@app/core/services/logger.service';
import { User } from '@app/core/models/user.model';

const log = new Logger('AuthService');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private subject so that only this class can fill the flow
  // behaviorSubject in order to define an initial value
  // public observable, to be read by external objects
  // distinctUntilChanged added because the object can be potentially big
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  // we use a replaysubject so that every new subscribers can get the state set before its subscription
  // buffer set to 1 to still only have one current state
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private jwtService: JwtService, private router: Router) { }

  populate() { // executed at the initialisation of the app (app.component.ts)
    if (this.jwtService.getToken()) {
      this.apiService.get('/user', {token: this.jwtService.getToken()}).subscribe(
        data => {
          log.debug('Existing token recognized, retrieving user data');
          this.setAuth(data.user);
        },
        err => {
          log.debug('Existing token not recognized, cleaning stored data', err);
          this.purgeAuth();
        }
      );
    } else {
      log.debug('No existing token, cleaning stored data');
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials: any): Observable<User> {
    return this.apiService.post('/login', credentials).pipe(tap(
      data => {
        log.info('Credentials OK. Logging in...');
        this.setAuth(data.user);
      },
      err => {
        log.info('Unrecognized credentials, authentication failed.', err);
      }
    ));
  }

  logout() {
    this.purgeAuth();
    log.info('Logging out...');
    this.router.navigate(['login']);
  }
}