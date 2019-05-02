import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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
    // check if a token already exists
    if (this.jwtService.getToken()) {
      // if token exists, retrieve and store user infos
      const params = new HttpParams();
      params.set('token', this.jwtService.getToken());
      this.apiService.get('/user', params).subscribe(data => this.setAuth(data.user));
      // how to handle error?
    } else {
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
    return this.apiService.post('/login', credentials).pipe(map(data => {
      this.setAuth(data.user);
      return data.user;
    }));
    // how to handle error?
    // console.log('Credentials OK. Logging in...');
    // console.log('Unrecognized credentials, authentication failed.');
  }

  logout() {
    this.purgeAuth();
    console.log('Logging out...');
    this.router.navigate(['login']);
  }
}
