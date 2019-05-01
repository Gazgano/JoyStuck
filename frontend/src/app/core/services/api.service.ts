import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  get(path: string, params: any) {
    if (path === '/login' && params.username === 'admin' && params.password === 'admin') {
      return true;
    } else {
      return false;
    }
  }
}
