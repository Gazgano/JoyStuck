import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ApiService, baseUrl } from '@app/core/services/api.service';
import { Logger } from './logger.service';
import { User } from '../models/user.model';

const log = new Logger('UserService');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl + 'users')
  }

  deleteUser(id: string): Observable<string> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.delete(baseUrl + 'users/' + id, options)),
      map(() => id)
    );
  }
}
