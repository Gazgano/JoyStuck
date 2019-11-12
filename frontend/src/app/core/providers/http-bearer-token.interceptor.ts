import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Logger } from '../services/logger.service';
import { ApiService } from '../services/api.service';
import { map, mergeMap } from 'rxjs/operators';

const log = new Logger('HttpBearerTokenInterceptor');

export class HttpBearerTokenInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => {
        const authReq = req.clone(options);
        return next.handle(authReq);
      })
    );
  }
}
