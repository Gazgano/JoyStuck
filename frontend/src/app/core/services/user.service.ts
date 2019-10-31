import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

import { ApiService, baseUrl } from '@app/core/services/api.service';
import { Logger } from './logger.service';
import { ErrorService } from './error.service';

const log = new Logger('UserService');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private apiService: ApiService, private errorService: ErrorService) { }

  getUserInfos(userId: string): Observable<any> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<any>(`${baseUrl}users/${userId}`, options)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting user info');
      })
    );
  }
}
