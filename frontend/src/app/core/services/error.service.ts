import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UppercaseFirstLetterPipe } from '@app/shared/pipes/uppercase-first-letter.pipe';
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
    if (!resultError.message) {
      resultError.message = defaultMessage;
    }
    if (resultError.code && resultError.statusText) {
      resultError.message += ` (code ${resultError.code}, ${resultError.statusText})`;
    } else if (resultError.code) {
      resultError.message += ` (code ${resultError.code})`;
    } else if (resultError.statusText) {
      resultError.message += ` (${resultError.statusText})`;
    }

    if (displaySnackbar) {
      this.matSnackBar.open(
        (new UppercaseFirstLetterPipe()).transform(resultError.message),
        'Dismiss',
        { duration: 5000 }
      );
    }

    return resultError;
  }
}
