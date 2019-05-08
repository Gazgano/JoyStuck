import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit {

  @ViewChild('username') usernameMatInput: ElementRef;
  public credentials: any;
  public isLoading = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.credentials = {
      username: null,
      password: null
    };
  }

  ngAfterContentInit() {
    this.usernameMatInput.nativeElement.focus();
  }

  onSubmit() {
    this.isLoading = true;
    this.userService.login(this.credentials).subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        this.isLoading = false;
      }
    );
  }

}
