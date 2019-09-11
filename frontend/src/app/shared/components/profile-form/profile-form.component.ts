import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@app/core/models/user.model';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  @Input() currentUser: User;
  @Input() isSubmitting: boolean;
  @Output() formSubmit = new EventEmitter<any>();

  public profileForm: FormGroup;
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
      username: [ 
        (this.currentUser && this.currentUser.username) || '', 
        [Validators.required, Validators.pattern('^[ a-zA-Z0-9]*$'), Validators.minLength(3)]
      ],
      email: [
        (this.currentUser && this.currentUser.email) || '', 
        [Validators.required, Validators.email]
      ],
      passwords: this.fb.group({
        // Minimum eight characters, if changed, think to change help sentence in HTML as well
        password: ['', [Validators.minLength(8)]],
        confirmPassword: [''] // can contain 'mismatch' error, added by confirmPasswords validator
      }, { validators: this.formService.confirmPasswordsValidator })
    });
  }
  
  constructor(private fb: FormBuilder, private formService: FormService) { }

  ngOnInit() {
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
}
