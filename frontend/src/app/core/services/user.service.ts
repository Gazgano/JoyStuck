import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isAuthenticated: boolean;
  
  constructor(private router: Router) { 
    this.isAuthenticated = false;
  }

  login(credentials: any) {
    this.isAuthenticated = credentials.username === 'admin' && credentials.password === 'admin';
    this.router.navigate(['/']);
  }

  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }
}
