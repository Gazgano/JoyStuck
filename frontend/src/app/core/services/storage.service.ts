import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: firebase.storage.Storage;

  constructor() {
    this.storage = firebase.storage();
  }

  getProfileImage(user: User) {
    if (user.profileImageSrcUrl) {
      const gsReference = this.storage.refFromURL(user.profileImageSrcUrl);
      return gsReference.getDownloadURL();
    } else {
      return null;
    }
  }

  uploadProfileImage(imageFile: File, user: User) {
    const extension = imageFile.name.split('.').pop();
    if (!['jpg', 'jpeg', 'png'].includes(extension)) {
      throw new Error('Provided file format is not valid');
    }

    const storageFileRef = this.storage.ref().child(`profile-images/${user.id}.${extension}`);
    return storageFileRef.put(imageFile);
  }
}
