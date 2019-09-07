import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';

type ErrorMessageFactory = (thing: string, state?: any) => string;
type Errors = 'required' | 'minlength' | 'pattern' | 'validateCardNumberWithAlgo';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  public currentUser: User;
  public profileForm: FormGroup;
  private errorFactory: {[e in Errors]: ErrorMessageFactory} = {
    required: (thing) => `You must enter a ${thing}`,
    minlength: (thing, state) => `A ${thing} must be at least ${state.errors.minlength.requiredLength}characters`,
    pattern: (thing) => `The ${thing} contains illegal characters`,
    validateCardNumberWithAlgo: (thing) => `Card doesnt pass algo`
  };
  
  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
    this.profileForm = this.initProfileForm();
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
  
  onSubmit(username: string) {
    this.profileForm.markAllAsTouched();
    console.log(this.getErrorMessage(this.profileForm.get('username'), 'username'));
    // const user: User = {...this.currentUser, username};
    // this.authService.updateProfile(user);
  }

  getErrorMessage(state: any, thingName?: string) {
    let result = [];
    if (state.errors) {
      for (let error in state.errors) {
        result.push(this.errorFactory[error](thingName, state));
      }
    }
    return result;
  }
  
  private confirmPasswordsValidator(group: FormGroup): ValidationErrors | null { 
    const passwordControl = group.controls.password;
    const confirmPasswordControl = group.controls.confirmPassword;
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
  
  private initProfileForm() {
    return this.fb.group({
      username: [this.currentUser.username, [Validators.required, Validators.pattern('^[ a-zA-Z0-9]*$')]],
      email: ['email', [Validators.required, Validators.email]],
      phoneNumber: ['phoneNumber', [Validators.pattern('^[0-9]{10}$')]],
      passwords: this.fb.group({
        password: ['', [Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')]],
        confirmPassword: ['']
      }, { validators: this.confirmPasswordsValidator })
    });
  }
}
