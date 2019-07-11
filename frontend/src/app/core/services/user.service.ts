import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../models/user.model';
import { baseUrl } from '@app/core/services/api.service';
import { Logger } from './logger.service';

const log = new Logger('UserService');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl + 'users').pipe(
      catchError(log.handleError)
    );
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete(baseUrl + 'users/' + user.id).pipe(
      map(() => user),
      catchError(log.handleError)
    );
  }
}
