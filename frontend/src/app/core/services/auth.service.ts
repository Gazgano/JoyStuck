import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import { Logger } from '@app/core/services/logger.service';
import { User } from '@app/core/models/user.model';
import { WINDOW } from '../providers/window.provider';

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
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  /* we use a replaysubject so that every new subscribers can get the state set before its subscription
     buffer set to 1 to still only have one current state
  */
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router, @Inject(WINDOW) private window: Window) { }

  initializeAuth() { // called in app.component.ts
    firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user));
  }

  signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  sendVerificationEmail() {
    return firebase.auth().currentUser.sendEmailVerification();
  }

  sendPwdResetEmail(email: string) {
    const continueUrl = `${this.window.location.origin}/`;
    const actionCodeSettings = {
      url: continueUrl,
      handleCodeInApp: true
    };

    return firebase.auth().sendPasswordResetEmail(email, actionCodeSettings);
  }

  signOut(): void {
    firebase.auth().signOut();
    log.info('Signed out');
    this.router.navigate(['login']);
  }

  getCurrentUser(): User {
    return this.currentUserSubject.getValue();
  }

  async createNewUser(userData: any) {
    return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
    .then(() => firebase.auth().currentUser.updateProfile({ displayName: userData.displayName }))
    .then(() => this.onAuthStateChanged(firebase.auth().currentUser)); // we refresh this.currentUser with the new profile data
  }

  async updateProfile(profileInfos: any) {
    const currentUser = firebase.auth().currentUser;
    return currentUser.updateProfile({
      displayName: profileInfos.displayName,
      photoURL: profileInfos.photoURL
    })
    .then(() => currentUser.updateEmail(profileInfos.email))
    .then(() => { if (profileInfos.password) {
        return currentUser.updatePassword(profileInfos.password);
      } else {
        return;
    }});
  }

  private onAuthStateChanged(user: firebase.User) {
    if (user) {
      this.currentUserSubject.next(this.mapUser(user));
      this.isAuthenticatedSubject.next(true);
      log.info(`User ${user.displayName} is now signed in`);
    } else {
      this.currentUserSubject.next({} as User);
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
