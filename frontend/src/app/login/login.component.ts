import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { AuthService } from '@app/core/services/auth.service';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('LoginComponent');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit, AfterContentInit {

  @ViewChild('email', { static: true }) emailMatInput: ElementRef;

  public errorMessage: string;
  public isLoading = false;
  public passwordFormControl: FormControl;
  public emailFormControl: FormControl;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.emailFormControl = new FormControl('', Validators.required);
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
      data => {
        this.isLoading = false;
        this.router.navigateByUrl('/');
      }, err => {
        log.info(err);
        log.info(`Authentication failed (error code ${err.code})`);
        this.errorMessage = err.message;
      }
    );
  }
}
