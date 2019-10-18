import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import { Logger } from '@app/core/services/logger.service';
import { User } from '@app/core/models/user.model';
import { WINDOW } from '../providers/window.provider';
import { ErrorService } from './error.service';

const log = new Logger('AuthService');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* private subject so that only this class can fill the flow
     behaviorSubject in order to define an initial value
     public observable, to be read by external objects
     distinctUntilChanged added because the object can be potentially big
  */
  private currentUserSubject$ = new BehaviorSubject<User>({} as User);
  public currentUser$ = this.currentUserSubject$.asObservable().pipe(distinctUntilChanged());

  /* we use a replaysubject so that every new subscribers can get the state set before its subscription
     buffer set to 1 to still only have one current state
  */
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router, 
    @Inject(WINDOW) private window: Window,
    private errorService: ErrorService,
    private matSnackBar: MatSnackBar
  ) { }

  initializeAuth() { // called in app.component.ts
    firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user));
  }

  async signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => { throw this.errorService.handleError(err, 'An error happened while signing in', true); });
  }

  async sendVerificationEmail() {
    return firebase.auth().currentUser.sendEmailVerification()
    .catch(err => { throw this.errorService.handleError(err, 'An error happened while sending the verification email', true); });
  }

  async sendPwdResetEmail(email: string) {
    const continueUrl = `${this.window.location.origin}/`;
    const actionCodeSettings = {
      url: continueUrl,
      handleCodeInApp: true
    };

    return firebase.auth().sendPasswordResetEmail(email, actionCodeSettings)
    .catch(err => { throw this.errorService.handleError(err, 'An error happened while sending the reset password email', true); });
  }

  signOut(): void {
    firebase.auth().signOut()
    .then(() => {
      log.info('Signed out');
      this.router.navigate(['login']);
    })
    .catch(err => { throw this.errorService.handleError(err, 'An error happened while logging out', true); });
  }

  getCurrentUser(): User {
    return this.currentUserSubject$.getValue();
  }

  async createNewUser(userData: any) {
    return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
    .then(() => firebase.auth().currentUser.updateProfile({ displayName: userData.displayName }))
    .then(() => this.onAuthStateChanged(firebase.auth().currentUser)) // we refresh this.currentUser with the new profile data
    .catch(err => { throw this.errorService.handleError(err, 'An error happened while creating the account', true); });
  }

  async updateProfile(profileInfos: any) {
    const currentUser = firebase.auth().currentUser;
    
    return this.buildUpdateProfilePromise(profileInfos, currentUser)
    .then(() => this.currentUserSubject$.next(this.mapUser(currentUser)))
    .then(() => {
      this.matSnackBar.open(`User's infos updated successfully`, 'Dismiss', { duration: 3000 });
      log.info(`User's infos updated successfully`);
    })
    .catch(err => { throw this.errorService.handleError(err, 'An error happened while updating profile', true); });
  }

  private buildUpdateProfilePromise(profileInfos: any, currentUser: firebase.User) {
    let updateProfilePromise = Promise.resolve();

    // if something is wrong, we don't update it (exception for photoURL which can be null)
    if (profileInfos.photoURL !== undefined && profileInfos.displayName) {
      updateProfilePromise = updateProfilePromise.then(() =>
        currentUser.updateProfile({ displayName: profileInfos.displayName, photoURL: profileInfos.photoURL })
      );
    } else if (profileInfos.displayName) {
      updateProfilePromise = updateProfilePromise.then(() => currentUser.updateProfile({ displayName: profileInfos.displayName }));
    } else if (profileInfos.photoURL !== undefined) {
      updateProfilePromise = updateProfilePromise.then(() => currentUser.updateProfile({ photoURL: profileInfos.photoURL }));
    }

    if (profileInfos.email) {
      updateProfilePromise = updateProfilePromise.then(() => currentUser.updateEmail(profileInfos.email));
    }

    if (profileInfos.password) {
      updateProfilePromise = updateProfilePromise.then(() => currentUser.updatePassword(profileInfos.password));
    }

    return updateProfilePromise;
  }
  
  private onAuthStateChanged(user: firebase.User) {
    if (user) {
      this.currentUserSubject$.next(this.mapUser(user));
      this.isAuthenticatedSubject.next(true);
      log.info(`User ${user.displayName} is now signed in`);
    } else {
      this.currentUserSubject$.next({} as User);
      this.isAuthenticatedSubject.next(false);
      log.info('User is signed out');
    }
  }

  private mapUser(firebaseUser: firebase.User): User {
    return {
      id: firebaseUser.uid,
      username: firebaseUser.displayName,
      email: firebaseUser.email,
      profileImageSrcUrl: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified
    };
  }
}
