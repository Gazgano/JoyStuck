import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  public currentUser: User;
  public profileForm: FormGroup;
  
  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
    this.profileForm = this.initProfileForm();
  }

  
  onSubmit(username: string) {
    const user: User = {...this.currentUser, username};
    this.authService.updateProfile(user);
  }
  
  private sameFields(group: FormGroup): ValidationErrors | null { 
    let oldControl = null;
    for (const name in group.controls) {
      if (oldControl !== null && group.controls[name] !== oldControl.value) {
        return {
          message: `${oldControl.name} and ${name} don't match`,
          controlName1: oldControl.name,
          controlName2: name
        };
      } else {
        oldControl = { name, value: group.controls[name] };
      }
    }
    return null;
  }
  
  private initProfileForm() {
    return this.fb.group({
      username: [this.currentUser.username, Validators.required],
      email: ['email', [Validators.required, Validators.email]],
      phoneNumber: ['phoneNumber', [Validators.pattern('^[0-9]{10}$')]],
      passwords: this.fb.group({
        password: ['', [Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')]],
        confirmPassword: ['']
      }, { validators: this.sameFields })
    });
  }
}
