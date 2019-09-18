import { Component, Input, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stepTransitionTrigger } from './forgotten-pwd-dialog.animation';

const log = new Logger('ForgottenPwdDialogComponent');

type ForgottenPwdFormStep = 'FORM_FILL' | 'CONFIRMATION';

@Component({
  selector: 'app-forgotten-pwd-dialog',
  templateUrl: './forgotten-pwd-dialog.component.html',
  styleUrls: ['./forgotten-pwd-dialog.component.scss'],
  animations: [stepTransitionTrigger]
})
export class ForgottenPwdDialogComponent implements OnInit {
  @Input() isSubmitting = false;
  public emailFromLogin: string;
  public currentStep: ForgottenPwdFormStep = 'FORM_FILL';
  public recoveryEmailControl: FormControl;
  public capturedEmail: string;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private authService: AuthService, 
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ForgottenPwdDialogComponent>,
  ) { }

  ngOnInit() {
    this.emailFromLogin = this.data.email;
    this.recoveryEmailControl = new FormControl(this.emailFromLogin || '', [Validators.required, Validators.email]);
    this.reactToEnterKey();
  }

  sendRecoveryEmail() {
    if (this.recoveryEmailControl.valid) {
      this.isSubmitting = true;
      this.capturedEmail = this.recoveryEmailControl.value;
      this.authService.sendPwdResetEmail(this.capturedEmail)
      .then(() => this.currentStep = 'CONFIRMATION')
      .catch(err => {
        this.matSnackBar.open('An error happened while sending the recovery email', 'Dismiss', { duration: 5000 });
        log.handleError(err);
      })
      .finally(() => this.isSubmitting = false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  reactToEnterKey() {
    this.dialogRef.keydownEvents()
    .pipe(filter(keyEvent => keyEvent.key === 'Enter'))
    .subscribe(keyEvent => {
        this.sendRecoveryEmail();
    });
  }
}
