import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  displayDefaultImage = false;
  userName = 'Gazgano';
  userPicturePath = 'assets/images/gazgano-picture-64px.png';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.signOut();
    console.log('Logging out...');
    this.router.navigate(['login']);
  }
}
