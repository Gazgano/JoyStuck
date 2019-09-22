import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';

import { environment } from 'src/environments/environment';

export const baseUrl = environment.production?
  'https://us-central1-joystuck.cloudfunctions.net/api/':
  'http://localhost:5000/joystuck/us-central1/api/';

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
