import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';

const log = new Logger('ProfilePage');

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [FormService]
})
export class ProfilePageComponent implements OnInit {

  public currentUser: User;
  public profileForm: FormGroup;
  public isSubmitting = false;
  private errorsMessages = {
    username: {
      required: (fieldName: string) => `${fieldName} is required`,
      pattern: (fieldName: string) => `${fieldName} must contain only spaces and alphanumerical letters`,
      minlength: (fieldName: string, errors: any) => `${fieldName} must be at least ${errors.minlength.requiredLength} characters`
    },
    email: {
      required: (fieldName: string) => `${fieldName} is required`,
      email: (fieldName: string) => `${fieldName} format is not valid`
    },
    'passwords/password' : {
      pattern: (fieldName: string) => `${fieldName} format is not valid`,
      minlength: (fieldName: string, errors: any) => `${fieldName} must be at least ${errors.minlength.requiredLength} characters`
    },
    'passwords/confirmPassword' : {
      mismatch: () => `Both passwords are not identical`
    },
  };

  private initProfileForm(): FormGroup {
    return this.fb.group({
      username: [this.currentUser.username, [Validators.required, Validators.pattern('^[ a-zA-Z0-9]*$'), Validators.minLength(3)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      passwords: this.fb.group({
        // Minimum eight characters, if changed, think to change help sentence in HTML as well
        password: ['', [Validators.minLength(8)]],
        confirmPassword: [''] // can contain 'mismatch' error, added by confirmPasswords validator
      }, { validators: this.formService.confirmPasswordsValidator })
    });
  }
  
  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private formService: FormService, 
    private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
    this.profileForm = this.initProfileForm();
  }
  
  getErrorMessage(path: string | string[], fieldName: string) {
    return this.formService.getErrorMessage(this.profileForm, path, this.errorsMessages, fieldName);
  }

  atLeastOneDirty(form: AbstractControl): boolean {
    return this.formService.atLeastOneDirty(form);
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      this.updateProfile();
    }
  }
  
  private updateProfile() {
    this.isSubmitting = true;
    this.authService.updateProfile({
      displayName: this.profileForm.get('username').value,
      email: this.profileForm.get('email').value,
      password: this.profileForm.get(['passwords', 'password']).value
    }).then(() => {
      this.matSnackBar.open(`User's infos updated successfully`, 'Dismiss', { duration: 3000 });
      log.info(`User's infos updated successfully`);
    }).catch(err => {
      this.matSnackBar.open('An error happened while updating profile', 'Dismiss', { duration: 3000 });
      log.handleError(err);
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
