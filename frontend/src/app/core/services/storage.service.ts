import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: firebase.storage.Storage;
  
  constructor() {
    this.storage = firebase.storage();
  }

  storageTest() {
    const storageRef = this.storage.ref();
    const gazganoImageRef = storageRef.child('profile-images/gazgano-picture-64px.png');
    return gazganoImageRef.getDownloadURL();
  }
}
