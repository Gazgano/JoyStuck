import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const ONLY_USER = {
  username: 'admin',
  password: 'admin',
  token: '123456789'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  get(path: string, params?: HttpParams): Observable<any> {
    let res: Observable<any>;
    
    switch(path) {
      case '/user':
        if (params.get('token') === ONLY_USER.token) {
          res = of({user: {
            username: ONLY_USER.username,
            token: ONLY_USER.token
          }})
        }
    }

    return res.pipe(delay(1000));
  }

  post(path: string, body: any): Observable<any> {
    let res: Observable<any>;
    
    switch(path) {
      case '/login':
        if (body.username === ONLY_USER.username && body.password === ONLY_USER.password) {
          res = of({user: {
            username: ONLY_USER.username,
            token: ONLY_USER.token
          }});
        } else {
          res = of({ error: {
            errorCode: 401,
            errorMessage: 'Unauthorized'
          }});
        }
    }

    return res.pipe(delay(1000));
  }
}
