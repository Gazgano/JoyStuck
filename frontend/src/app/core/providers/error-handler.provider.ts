import { ErrorHandler, Injectable } from '@angular/core';

import { Logger } from '../services/logger.service';

const log = new Logger('AppErrorHandler');

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: any) {
    log.error(error);
  }
}
