import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Logger } from '../services/logger.service';

const log = new Logger('HttpErrorInterceptor');

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1), // we always retry once
      catchError((err: HttpErrorResponse) => {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) { // client-side error
          errorMessage = `Error: ${err.error.message}`;
        } else { // server-side error
          errorMessage = `Error code: ${err.status}\nMessage: ${err.message}`;
        }
        log.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}
