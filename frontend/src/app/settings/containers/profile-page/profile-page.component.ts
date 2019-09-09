import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
  
  constructor(private authService: AuthService, private fb: FormBuilder, private formService: FormService) { }

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
    this.formService.getErrorMessage(this.profileForm, path, this.errorMessagesFactory, fieldName);
  }

  atLeastOneDirty(form: AbstractControl): boolean {
    return this.formService.atLeastOneDirty(form);
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
      }, { validators: this.formService.confirmPasswordsValidator })
    });
  }
}
