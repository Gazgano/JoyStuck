import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  displayDefaultImage = false;
  userName = 'Gazgano';
  userPicturePath = 'assets/images/gazgano-picture-64px.png';

  constructor() { }

  ngOnInit() {
  }

  onUserMenuClick() {
  }

}
