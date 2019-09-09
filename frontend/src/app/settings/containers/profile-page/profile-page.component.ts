import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('ProfilePage');

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  public currentUser: User;
  public profileForm: FormGroup;
  private errorMessagesFactory = {
    username: {
      required: (fieldName: string) => `${fieldName} is required`,
      pattern: (fieldName: string) => `${fieldName} must contain only spaces and alphanumerical letters`,
      minlength: (fieldName: string, errors: any) => `${fieldName} must be at least ${errors.minlength.requiredLength} characters`
    },
    email: {
      required: (fieldName: string) => `${fieldName} is required`,
      email: (fieldName: string) => `${fieldName} format is not valid`
    },
    phoneNumber: {
      pattern: (fieldName: string) => `${fieldName} must be 10 numbers`
    },
    'passwords/password' : {
      pattern: (fieldName: string) => `${fieldName} format is not valid`
    },
    'passwords/confirmPassword' : {
      mismatch: () => `Both passwords are not identical`
    },
  };
  
  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
    this.profileForm = this.initProfileForm();
  }
  
  onSubmit(username: string) {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      const user: User = {...this.currentUser, username};
      this.authService.updateProfile(user);
    }
  }

  getErrorMessage(path: string | string[], fieldName: string) {
    const field = this.profileForm.get(path);
    const key = Array.isArray(path)? path.join('/') : path;
    
    if (field.errors && !_.isEmpty(field.errors)) {
      const errorCode = Object.keys(field.errors)[0]; // get first error
      if (this.errorMessagesFactory[key] && this.errorMessagesFactory[key][errorCode]) {
        return this.errorMessagesFactory[key][errorCode](fieldName, field.errors);
      } else {
        log.warn(`No message defined for error code '${errorCode}' in field path '${key}'`);
        return `${fieldName} is not valid`;
      }
    } else {
      return null;
    }
  }

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

  private initProfileForm(): FormGroup {
    return this.fb.group({
      username: [this.currentUser.username, [Validators.required, Validators.pattern('^[ a-zA-Z0-9]*$'), Validators.minLength(3)]],
      email: ['email', [Validators.required, Validators.email]],
      phoneNumber: ['phoneNumber', [Validators.pattern('^[0-9]{10}$')]],
      passwords: this.fb.group({
        // Minimum eight characters, at least one letter and one number
        // If changed, think to change help sentence in HTML as well
        password: ['', [Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$')]],
        confirmPassword: [''] // can contain 'mismatch' error, added by confirmPasswords validator
      }, { validators: this.confirmPasswordsValidator })
    });
  }

  private confirmPasswordsValidator(formGroup: FormGroup): ValidationErrors | null { 
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
}
