import { Component, OnInit } from '@angular/core';

import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayDefaultImage = false;
  public userName: string;
  public userPicturePath = 'assets/images/gazgano-picture-64px.png';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userName = this.authService.getUsername();
  }

  logout() {
    this.authService.signOut();
  }
}
