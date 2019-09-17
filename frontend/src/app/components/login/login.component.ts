import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@app/core/services/auth.service';
import { Logger } from '@app/core/services/logger.service';
import { SignupDialogComponent } from '@app/components/signup-dialog/signup-dialog.component';
import { ForgottenPwdDialogComponent } from '../forgotten-pwd-dialog/forgotten-pwd-dialog.component';

const log = new Logger('LoginComponent');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit, AfterContentInit {

  @ViewChild('email', { static: true }) emailMatInput: ElementRef;

  public isLoading = false;
  public passwordFormControl: FormControl;
  public emailFormControl: FormControl;

  constructor(private router: Router, private authService: AuthService, private matDialog: MatDialog) { }

  ngOnInit() {
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordFormControl = new FormControl('', Validators.required);
  }

  ngAfterContentInit() {
    this.emailMatInput.nativeElement.focus();
  }

  onSubmit() {
    this.isLoading = true;
    this.signIn(this.emailFormControl.value, this.passwordFormControl.value);
  }

  signIn(email: string, password: string) {
    this.authService.signIn(email, password).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigateByUrl('/');
      }, err => {
        this.isLoading = false;
        log.info(`Authentication failed (error code ${err.code})`);
      }
    );
  }

  openSignupDialog() {
    this.matDialog.open(SignupDialogComponent);
  }

  openForgottenPwdDialog() {
    this.matDialog.open(ForgottenPwdDialogComponent, { data: { email: this.emailFormControl.value } });
  }
}
