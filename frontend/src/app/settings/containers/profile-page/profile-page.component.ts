import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  public currentUser: User;
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user =>
      this.currentUser = user
    );
  }
  
  onSubmit(username: string) {
    const user: User = {...this.currentUser, username};
    this.authService.updateProfile(user);
  }
}
