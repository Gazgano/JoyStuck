import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import * as uid from 'uid';

import { User } from '../models/user.model';
import { ErrorService } from './error.service';
import { Logger } from './logger.service';

const log = new Logger('StorageService');

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: firebase.storage.Storage;

  constructor(private errorService: ErrorService) {
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

  uploadPostImage(file: File): Observable<{ file: File, uploadProgress: number | null, storageURL: string | null }> {
    const extension = file.name.split('.').pop();
    if (!['jpg', 'jpeg', 'png'].includes(extension)) {
      throw new Error('Provided file format is not valid');
    }

    const date = moment().format('YYYYMMDD');
    const storageFileRef = this.storage.ref().child(`post-images/${date}/${uid(20)}.${extension}`);
    const uploadTask = storageFileRef.put(file);

    return new Observable(subscriber => {
      uploadTask.on('state_changed', 
        snapshot => {
          const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          subscriber.next({ file, uploadProgress, storageURL: null });
        },
        err => {
          subscriber.error(this.errorService.handleError(err, `An error happened while uploading '${file.name}'`));
        },
        () => uploadTask.snapshot.ref.getDownloadURL().then(storageURL => {
          log.info(`${file.name} uploaded successfully.`);
          subscriber.next({ file, uploadProgress: 100, storageURL });
          subscriber.complete();
        })
      );
    });
  }
}
