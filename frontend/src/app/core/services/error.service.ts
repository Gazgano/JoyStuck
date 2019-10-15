import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Logger } from './logger.service';

const log = new Logger('ErrorService');

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private matSnackBar: MatSnackBar) { }

  handleError(error: any, defaultMessage: string) {
    log.error(error);
    
    let message: string;
    if (error.code && error.message) {
      message = error.message;
    } else {
      message = defaultMessage;
    }
    this.matSnackBar.open(message, 'Dismiss', { duration: 5000 });

    return error;
  }
}
