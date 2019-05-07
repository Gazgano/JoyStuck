import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

const ONLY_USER = {
  username: 'admin',
  password: 'admin',
  token: '123456789'
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  get(path: string, params?: any): Observable<any> {
    let res: Observable<any>;

    switch(path) {
      case '/user':
        if (params.token === ONLY_USER.token) {
          res = of({user: {
            username: ONLY_USER.username,
            token: ONLY_USER.token
          }});
        } else {
          res = throwError({
            errorCode: 410,
            errorName: 'Gone'
          });
        }
        break;
      default:
        res = throwError({
          errorCode: 404,
          errorName: 'Not Found'
        });
    }

    return res.pipe(  // need to use materialize/dematerialize to make
      materialize(),  // delay apply on all notifications
      delay(1000),    // otherwise, delay is not applied on errors
      dematerialize()
    );
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
          res = throwError({
            errorCode: 401,
            errorName: 'Unauthorized'
          });
        }
        break;
      default:
        res = throwError({
          errorCode: 404,
          errorName: 'Not Found'
        });
    }

    return res.pipe(
      materialize(),
      delay(1000),
      dematerialize()
    );
  }
}
