import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';

export const baseUrl = environment.production?
  'https://us-central1-joystuck.cloudfunctions.net/api/':
  'http://localhost:5000/joystuck/us-central1/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private jwt: JwtService) {}

  getReqOptions(): {headers: HttpHeaders} {
    return { headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      // Authorization: this.jwt.getToken()
    })};
  }
}
