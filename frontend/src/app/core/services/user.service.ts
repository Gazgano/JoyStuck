import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    private errorService: ErrorService,
    @Inject(BASE_URL) private baseUrl: string
  ) { }

  getUserInfos(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}users/${userId}`).pipe(
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting user info');
      })
    );
  }
}
