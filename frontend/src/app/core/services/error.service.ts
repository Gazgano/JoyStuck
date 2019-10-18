import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Logger } from './logger.service';

const log = new Logger('ErrorService');

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private matSnackBar: MatSnackBar) { }

  handleError(error: any, defaultMessage: string, displaySnackbar: boolean = false) {
    log.error(error);
    
    const resultError = {...error};
    if (!resultError.message || !resultError.code) {
      resultError.message = defaultMessage;
    }

    if (displaySnackbar) {
      this.matSnackBar.open(resultError.message, 'Dismiss', { duration: 5000 });
    }

    return resultError;
  }
}
