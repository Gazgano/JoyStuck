import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

const log = new Logger('SignupDialogComponent');

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {

  public isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    private authService: AuthService, 
    private matSnackBar: MatSnackBar, 
    private router: Router
  ) { }

  onFormSubmit(formData: any) {
    this.isSubmitting = true;
    this.authService.createNewUser(formData)
    .then(() => {
      this.matSnackBar.open(`Account creating with success. You're now logged in.`, 'Dismiss', { duration: 3000 });
      this.dialogRef.close();
      this.router.navigateByUrl('/');
    })
    .catch(err => {
      this.matSnackBar.open('An error happened while creating your account', 'Dismiss', { duration: 3000 });
      log.handleError(err);
    })
    .finally(() => 
      this.isSubmitting = false
    );
  }

  close() {
    this.dialogRef.close();
  }
}
