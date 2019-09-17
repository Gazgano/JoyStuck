import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { isEmpty } from 'lodash';

import { Logger } from '@app/core/services/logger.service';

const log = new Logger('FormService');

export type ErrorMessageFactory = (fieldName: string, errors?: any) => string;
export interface ErrorsMap {
  [errorCode: string]: ErrorMessageFactory;
}

@Injectable()
export class FormService {

  constructor() { }

  atLeastOneDirty(form: AbstractControl): boolean {
    if (form instanceof FormControl) {
      return form.dirty;
    } else if (form instanceof FormGroup) {
      for (const controlName in form.controls) {
        if (this.atLeastOneDirty(form.controls[controlName]) === true) {
          return true;
        }
      }
      return false;
    } else {
      throw new Error('Provided form is neither a FormControl nor a FormGroup');
    }
  }

  getErrorMessage(form: AbstractControl, path: string | string[], errorsMessages: {[key: string]: ErrorsMap}, fieldName: string) {
    const field = form.get(path);
    const key = Array.isArray(path)? path.join('/') : path;
    
    if (field.errors && !isEmpty(field.errors)) {
      const errorCode = Object.keys(field.errors)[0]; // get first error
      if (errorsMessages[key] && errorsMessages[key][errorCode]) {
        return errorsMessages[key][errorCode](fieldName, field.errors);
      } else {
        log.warn(`No message defined for error code '${errorCode}' in field path '${key}'`);
        return `${fieldName} is not valid`;
      }
    } else {
      return null;
    }
  }

  confirmPasswordsValidator(formGroup: FormGroup): ValidationErrors | null { 
    const passwordControl = formGroup.controls.password; 
    const confirmPasswordControl = formGroup.controls.confirmPassword;
    if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, mismatch: true });
        return { mismatch: true };
    } else {
      if (confirmPasswordControl.errors && confirmPasswordControl.errors.mismatch) {
        delete confirmPasswordControl.errors.mismatch;
      }
      return null;
    }
  }

  notEmptyStringValidator(control: FormControl): ValidationErrors | null { 
    if (!control.value) {
      return { emptyString: true };
    }
    return (control.value as string).trim().length === 0? { emptyString: true } : null;
  }
}
