import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, Observable, from } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Logger } from '@app/core/services/logger.service';
import { User } from '@app/core/models/user.model';
import { clientUrl } from '@app/core/services/api.service';

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

  constructor(private router: Router) { }

  initializeAuth() { // called in app.component.ts
    firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user));
  }

  signIn(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().signInWithEmailAndPassword(email, password));
  }

  sendSigninEmail(email: string) {
    const actionCodeSettings = {
      url: `${clientUrl}`,
      handleCodeInApp: true
    };

    return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
  }

  signOut(): void {
    firebase.auth().signOut();
    log.info('Signed out');
    this.router.navigate(['login']);
  }

  getUsername(): string {
    let username: string;
    this.currentUser.pipe(take(1)).subscribe(user => username = user.username);
    return username;
  }

  async createNewUser(userData: any) {
      return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
    .then(() => firebase.auth().currentUser.updateProfile({ displayName: userData.displayName }))
    .then(() => this.onAuthStateChanged(firebase.auth().currentUser)); // we refresh this.currentUser with the new profile data
  }

  async updateProfile(profileInfos: any) {
    const currentUser = firebase.auth().currentUser;
    return currentUser.updateProfile({ displayName: profileInfos.displayName })
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
      profileImageSrcUrl: firebaseUser.photoURL
    };
  }
}
