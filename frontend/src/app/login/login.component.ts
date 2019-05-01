import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit {

  @ViewChild('username') usernameMatInput: ElementRef;
  public credentials: any;
  public isLoading: boolean;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.credentials = {
      username: null,
      password: null
    };

    this.isLoading = false;
  }

  ngAfterContentInit() {
    this.usernameMatInput.nativeElement.focus();
  }

  onSubmit() {
    // this.isLoading = true;
    this.userService.login(this.credentials);
  }

}
