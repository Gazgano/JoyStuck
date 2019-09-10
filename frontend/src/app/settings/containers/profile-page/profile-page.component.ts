import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';

const log = new Logger('ProfilePage');

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [FormService]
})
export class ProfilePageComponent implements OnInit {

  public currentUser: User;
  public isSubmitting = false;
  
  constructor(
    private authService: AuthService, 
    private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  updateProfile(profileData: any) {
    this.isSubmitting = true;
    this.authService.updateProfile({
      displayName: profileData.username,
      email: profileData.email,
      password: profileData.password
    }).then(() => {
      this.matSnackBar.open(`User's infos updated successfully`, 'Dismiss', { duration: 3000 });
      log.info(`User's infos updated successfully`);
    }).catch(err => {
      this.matSnackBar.open('An error happened while updating profile', 'Dismiss', { duration: 3000 });
      log.handleError(err);
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
