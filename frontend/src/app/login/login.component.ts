import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@app/core/services/user.service';
import { Credentials } from '@app/core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit {

  // @ViewChild('username') usernameMatInput: ElementRef;

  public badCredentials = false;
  public isLoading = false;
  public passwordFormControl: FormControl;
  public usernameFormControl: FormControl;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.usernameFormControl = new FormControl('', Validators.required);
    this.passwordFormControl = new FormControl('', Validators.required);
  }

  ngAfterContentInit() {
    // this.usernameMatInput.nativeElement.focus();
  }

  onSubmit() {
    const credentials: Credentials = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value
    };

    this.isLoading = true;
    this.userService.login(credentials).subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        this.badCredentials = true;
        this.isLoading = false;
      }
    );
  }

}
