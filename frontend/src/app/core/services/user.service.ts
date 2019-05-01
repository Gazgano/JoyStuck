import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtService } from './jwt.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService, private jwtService: JwtService, private router: Router) { }
  
  login(credentials: any): void {
    if (this.apiService.get('/login', credentials)) {
      this.jwtService.saveToken('true');
      console.log('Credentials OK. Logging in...');
      this.router.navigate(['/']);
    } else {
      this.jwtService.saveToken('false');
      console.log('Unrecognized credentials, authentication failed.');
    }
  }

  logout() {
    this.jwtService.destroyToken();
    console.log('Logging out...');
    this.router.navigate(['login']);
  }

  getAuthenticationState(): boolean {
    return this.jwtService.getToken() === 'true'? true : false;
  }
}
