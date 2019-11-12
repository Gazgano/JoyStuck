import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

import { ApiService } from '@app/core/services/api.service';
import { Logger } from './logger.service';
import { ErrorService } from './error.service';
import { BASE_URL } from '@app/core/providers/base-url.provider';

const log = new Logger('UserService');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient, 
    private apiService: ApiService, 
    private errorService: ErrorService,
    @Inject(BASE_URL) private baseUrl: string
  ) { }

  getUserInfos(userId: string): Observable<any> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<any>(`${this.baseUrl}users/${userId}`, options)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting user info');
      })
    );
  }
}
