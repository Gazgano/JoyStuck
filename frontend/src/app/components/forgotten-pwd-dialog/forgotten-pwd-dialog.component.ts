import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { stepTransition } from '@app/shared/animations/step-transition.animation';

const log = new Logger('ForgottenPwdDialogComponent');

type ForgottenPwdFormStep = 'FORM_FILL' | 'CONFIRMATION';

@Component({
  selector: 'app-forgotten-pwd-dialog',
  templateUrl: './forgotten-pwd-dialog.component.html',
  styleUrls: ['./forgotten-pwd-dialog.component.scss'],
  animations: [stepTransition(
    'moveStepForwardTrigger',
    'right',
    'FORM_FILL => CONFIRMATION', 
    '.ForgottenPwd-Form', 
    '.ForgottenPwd-Confirmation'
  )]
})
export class ForgottenPwdDialogComponent implements OnInit, OnDestroy {
  @Input() isSubmitting = false;
  public emailFromLogin: string;
  public currentStep: ForgottenPwdFormStep = 'FORM_FILL';
  public recoveryEmailControl: FormControl;
  public capturedEmail: string;
  private enterKeySubscription: Subscription;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private authService: AuthService, 
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
      .finally(() => this.isSubmitting = false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private reactToEnterKey() {
    this.enterKeySubscription = this.dialogRef.keydownEvents()
    .pipe(filter(keyEvent => keyEvent.key === 'Enter'))
    .subscribe(() => this.sendRecoveryEmail());
  }

  ngOnDestroy() {
    this.enterKeySubscription.unsubscribe();
  }
}
