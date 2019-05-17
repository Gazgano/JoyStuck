import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  displayDefaultImage = false;
  userName = 'Gazgano';
  userPicturePath = 'assets/images/gazgano-picture-64px.png';

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }

}
