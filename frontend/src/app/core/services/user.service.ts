import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const IS_AUTHENTICATED_KEY = 'isAuthenticated';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private router: Router) { }
  
  login(credentials: any): void {
    const credentialsOK = credentials.username === 'admin' && credentials.password === 'admin';
    window.localStorage.setItem(IS_AUTHENTICATED_KEY, credentialsOK? 'true' : 'false');
    
    if (credentialsOK) {
      console.log('Credentials OK. Logging in...');
      this.router.navigate(['/']);
    } else {
      console.log('Unrecognized credentials, authentication failed.');
    }
  }

  logout() {
    window.localStorage.setItem(IS_AUTHENTICATED_KEY, 'false');
    
    console.log('Logging out...');
    this.router.navigate(['login']);
  }

  getAuthenticationState(): boolean {
    return window.localStorage.getItem(IS_AUTHENTICATED_KEY) === 'true'? true : false;
  }
}
