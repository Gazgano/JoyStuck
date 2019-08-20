import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { JwtService } from './jwt.service';

export const baseUrl = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private jwt: JwtService) {}

  getReqOptions(): {headers: HttpHeaders} {
    return { headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: this.jwt.getToken()
    })};
  }
}
