import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { FormService } from '@app/shared/services/form.service';
import { User } from '@app/core/models/user.model';
import { Logger } from '@app/core/services/logger.service';
import { filter } from 'rxjs/operators';

export type ProfileFormType = 'UPDATE' | 'NEW';

const log = new Logger('ProfileFormComponent');

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnDestroy {

  @Input() currentUser: User;
  @Input() profileFormType: ProfileFormType;
  @Input() triggerSubmission: Observable<boolean>;
  @Output() formSubmit = new EventEmitter<any>();

  private triggerSubmissionSubscription: Subscription;
  public profileForm: FormGroup;
  private errorsMessages = {
    username: {
      required: (fieldName: string) => `${fieldName} is required`,
      emptyString: (fieldName: string) => `${fieldName} must must not be empty`,
      minlength: (fieldName: string, errors: any) => `${fieldName} must be at least ${errors.minlength.requiredLength} characters`
    },
    email: {
      required: (fieldName: string) => `${fieldName} is required`,
      email: (fieldName: string) => `${fieldName} format is not valid`
    },
    'passwords/password' : {
      required: (fieldName: string) => `${fieldName} is required`,
      pattern: (fieldName: string) => `${fieldName} format is not valid`,
      minlength: (fieldName: string, errors: any) => `${fieldName} must be at least ${errors.minlength.requiredLength} characters`
    },
    'passwords/confirmPassword' : {
      mismatch: () => `Both passwords are not identical`
    },
  };

  constructor(private fb: FormBuilder, private formService: FormService) { }

  ngOnInit() {
    if (this.profileFormType === 'UPDATE' && !this.currentUser) {
      throw new Error('No user currently logged in');
    }
    this.profileForm = this.initProfileForm();
    this.reactToSubmissionTrigger();
  }

  private initProfileForm(): FormGroup {
    return this.fb.group({
      username: [
        this.profileFormType === 'UPDATE'? this.currentUser.username : '',
        [Validators.required, this.formService.notEmptyStringValidator, Validators.minLength(3)]
      ],
      email: [
        this.profileFormType === 'UPDATE'? this.currentUser.email : '',
        [Validators.required, Validators.email]
      ],
      passwords: this.fb.group({
        // Minimum eight characters, if changed, think to change help sentence in HTML as well
        password: ['', [Validators.minLength(8), this.profileFormType === 'NEW'? Validators.required : Validators.nullValidator]],
        confirmPassword: [''] // can contain 'mismatch' error, added by confirmPasswords validator
      }, { validators: this.formService.sameValueValidator('password', 'confirmPassword') })
    });
  }

  getErrorMessage(path: string | string[], fieldName: string) {
    return this.formService.getErrorMessage(this.profileForm, path, this.errorsMessages, fieldName);
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      this.formSubmit.emit({
        displayName: this.profileForm.get('username').value,
        email: this.profileForm.get('email').value,
        password: this.profileForm.get(['passwords', 'password']).value
      });
    }
  }

  private reactToSubmissionTrigger() {
    this.triggerSubmissionSubscription = this.triggerSubmission.pipe(
      filter(b => b === true)
    )
    .subscribe(() => this.onSubmit());
  }

  ngOnDestroy() {
    this.triggerSubmissionSubscription.unsubscribe();
  }
}
