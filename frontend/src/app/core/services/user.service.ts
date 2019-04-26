import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isAuthenticated: Subject<boolean>;
  
  constructor(private router: Router) {
    this.isAuthenticated = new Subject<boolean>();
    this.isAuthenticated.next(false);
  }

  login(credentials: any): Subject<boolean> {
    const credentialsOk = credentials.username === 'admin' && credentials.password === 'admin';
    this.isAuthenticated.next(credentialsOk);
    return this.isAuthenticated;
  }

  logout() {
    this.isAuthenticated.next(false);
    return this.isAuthenticated.pipe(delay(1000));
  }
}
