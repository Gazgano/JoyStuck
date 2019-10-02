import { ErrorHandler } from '@angular/core';

import { Logger } from '../services/logger.service';

const log = new Logger('AppErrorHandler');

export class AppErrorHandler implements ErrorHandler {
  handleError(error: any) {
    log.error(error);
  }
}
