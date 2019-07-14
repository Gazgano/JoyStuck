import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
    return this.http.get<User[]>(baseUrl + 'users').pipe(
      catchError(log.handleError)
    );
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete(baseUrl + 'users/' + user.id, this.apiService.getReqOptions()).pipe(
      map(() => user),
      catchError(log.handleError)
    );
  }
}
