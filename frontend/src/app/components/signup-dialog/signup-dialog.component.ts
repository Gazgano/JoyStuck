import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';

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
    private matSnackBar: MatSnackBar,
    private router: Router
  ) { }

  onFormSubmit(formData: any) {
    this.isSubmitting = true;
    this.capturedEmail = formData.email;
    
    this.authService.createNewUser(formData)
    .then(() => this.authService.sendVerificationEmail())
    .then(() => this.currentStep = 'CONFIRMATION')
    .catch(err => this.handleError(err, 'An error happened while creating your account', 5000))
    .finally(() => this.isSubmitting = false);
  }

  continue() {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }

  private handleError(err: any, message: string, duration?: number) {
    this.matSnackBar.open(message, 'Dismiss', { duration: duration || 3000 });
    log.handleError(err);
  }
}
