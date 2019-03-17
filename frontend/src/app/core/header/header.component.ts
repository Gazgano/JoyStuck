import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  countMessageAlerts = 1;
  countNotifAlerts = 3;
  displayDefaultImage = false;
  displayDropdown = false;
  userName = 'Gazgano';
  userPicturePath = 'assets/images/gazgano-picture-64px.png';

  constructor() { }

  ngOnInit() {
  }

  onUserMenuClick() {
    this.displayDropdown = !this.displayDropdown;
  }

}
