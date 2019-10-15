import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { stepTransition } from '@app/shared/animations/step-transition.animation';

const log = new Logger('SignupDialogComponent');

type SignupFormStep = 'FORM_FILL' | 'CONFIRMATION';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss'],
  animations: [stepTransition(
    'moveStepForwardTrigger',
    'right',
    'FORM_FILL => CONFIRMATION',
    '.Signup-Form',
    '.Signup-Confirmation'
  )]
})
export class SignupDialogComponent implements OnInit, OnDestroy {

  public isSubmitting = false;
  public currentStep: SignupFormStep = 'FORM_FILL';
  public capturedEmail: string;
  private enterKeySubscription: Subscription;
  private submissionSubject = new Subject<boolean>();
  public submissionObservable = this.submissionSubject.asObservable();

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.reactToEnterKey();
  }

  submitForm() {
    this.submissionSubject.next(true);
  }

  onFormSubmit(formData: any) {
    this.isSubmitting = true;
    this.capturedEmail = formData.email;

    this.authService.createNewUser(formData)
    .then(() => this.authService.sendVerificationEmail())
    .then(() => this.currentStep = 'CONFIRMATION')
    .finally(() => this.isSubmitting = false);
  }

  continue() {
    this.closeDialog();
    this.router.navigate(['/']);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private reactToEnterKey() {
    this.enterKeySubscription = this.dialogRef.keydownEvents()
    .pipe(filter(keyEvent => keyEvent.key === 'Enter'))
    .subscribe(() => {
      switch (this.currentStep) {
        case 'FORM_FILL':
          this.submissionSubject.next(true);
          break;
        case 'CONFIRMATION':
          this.continue();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.enterKeySubscription.unsubscribe();
  }
}
