import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

const log = new Logger('SignupDialogComponent');

type SignupFormStep = 'FORM_FILL' | 'CONFIRMATION';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {

  public isSubmitting = false;
  public currentStep: SignupFormStep = 'FORM_FILL';
  public capturedEmail: string;

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    private authService: AuthService, 
    private matSnackBar: MatSnackBar
  ) { }

  onFormSubmit(formData: any) {
    this.isSubmitting = true;
    this.authService.createNewUser(formData)
    .then(() => {
      this.capturedEmail = formData.email;
      this.currentStep = 'CONFIRMATION';
    })
    .catch(err => {
      this.matSnackBar.open('An error happened while creating your account', 'Dismiss', { duration: 3000 });
      log.handleError(err);
    })
    .finally(() => 
      this.isSubmitting = false
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
