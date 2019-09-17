import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

export const baseUrl = environment.production?
  'https://us-central1-joystuck.cloudfunctions.net/api/':
  'http://localhost:5000/joystuck/us-central1/api/';

export const clientUrl = environment.production?
  'https://joystuck.firebaseapp.com/':
  'http://localhost:4200/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  getReqOptions(): {headers: HttpHeaders} {
    return { headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })};
  }
}
