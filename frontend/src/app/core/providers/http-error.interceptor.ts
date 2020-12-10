import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Logger } from '../services/logger.service';
import { Injectable } from "@angular/core";

const log = new Logger('HttpErrorInterceptor');

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const resultError: any = {};
        if (err.error instanceof ErrorEvent) { // client-side error
          resultError.message = err.error.message;
        } else if (err.error instanceof ProgressEvent) { // connection errors
          resultError.code = err.status;
          resultError.statusText = err.statusText;
        } else { // server-side error
          resultError.code = err.status;
          resultError.statusText = err.statusText;
          resultError.message = err.error;
        }
        log.debug(err);
        log.debug(resultError);
        return throwError(resultError);
      })
    );
  }
}
