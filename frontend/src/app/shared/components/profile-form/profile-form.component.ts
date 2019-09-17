import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@app/core/models/user.model';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';

export type ProfileFormType = 'UPDATE' | 'NEW';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  @Input() currentUser: User;
  @Input() isSubmitting: boolean;
  @Input() profileFormType: ProfileFormType;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<boolean>();

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
      }, { validators: this.formService.confirmPasswordsValidator })
    });
  }
  
  constructor(private fb: FormBuilder, private formService: FormService) { }

  ngOnInit() {
    if (this.profileFormType === 'UPDATE' && !this.currentUser) {
      throw new Error('No user currently logged in');
    }
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
      this.formSubmit.emit({
        displayName: this.profileForm.get('username').value,
        email: this.profileForm.get('email').value,
        password: this.profileForm.get(['passwords', 'password']).value
      });
    }
  }

  onCancel() {
    this.formCancel.emit(true);
  }
}
