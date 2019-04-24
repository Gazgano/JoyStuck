import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isAuthenticated: boolean;
  
  constructor() { 
    this.isAuthenticated = false;
  }
}
