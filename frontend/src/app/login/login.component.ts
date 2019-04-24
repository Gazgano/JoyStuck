import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.credentials = {
      username: null,
      password: null
    };
  }

  onSubmit() {
    this.userService.login(this.credentials);
  }

}
