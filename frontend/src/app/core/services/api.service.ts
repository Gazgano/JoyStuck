import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  async getReqOptions(): Promise<{ headers: HttpHeaders }> {
    return this.getHeaders().then(headers => ({ headers }));
  }

  private async getHeaders(): Promise<HttpHeaders> {
    return firebase.auth().currentUser.getIdToken()
    .then(authToken => new HttpHeaders({
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json; charset=utf-8'
    }));
  }
}
