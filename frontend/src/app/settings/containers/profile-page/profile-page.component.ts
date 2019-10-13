import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, BehaviorSubject } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';
import { StorageService } from '@app/core/services/storage.service';
import { FileService } from '@app/core/services/file.service';

const log = new Logger('ProfilePage');

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [FormService]
})
export class ProfilePageComponent implements OnInit {

  @ViewChild('file', { static: false }) fileInput: ElementRef;

  public currentUser: User;

  public isSubmitting = false;
  private submissionSubject$ = new Subject<boolean>();
  public submissionObservable$ = this.submissionSubject$.asObservable();

  private loadedImageSubject$ = new BehaviorSubject<any>({});
  public loadedImage$ = this.loadedImageSubject$.asObservable();

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private storageService: StorageService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  cleanFileInput() { // reset the file input and display current user's image
    this.fileInput.nativeElement.value = '';
    this.loadedImageSubject$.next({});
  }

  deleteProfileImage() { // delete user's current image
    this.fileInput.nativeElement.value = '';
    this.loadedImageSubject$.next({ file: null, url: null });
  }

  submitForm() {
    this.submissionSubject$.next(true);
  }

  onSubmit(profileData: any) {
    /* If loadedImageSubject last value is {} (initial value), then we don't update the profile image.
       If it's { file: null, url: null }, we delete it (user deleted it). Otherwise ({ file: ..., url: ... }), we update it.
    */
    this.isSubmitting = true;
    const lastLoadedImage = this.loadedImageSubject$.getValue();
    let updatingProfilePromise: Promise<any>;

    if (lastLoadedImage === {}) {
      updatingProfilePromise = this.updateProfile({ ...profileData });
    } else if (lastLoadedImage.file === null) {
      updatingProfilePromise = this.updateProfile({...profileData, imageUrl: null });
    } else {
      updatingProfilePromise = this.uploadStoredProfileImage(lastLoadedImage.file)
      .then(imageUrl => this.updateProfile({...profileData, imageUrl }));
    }

    updatingProfilePromise.finally(() => this.isSubmitting = false);
  }

  readFile() {
    const file = this.fileInput.nativeElement.files[0];
    this.fileService.readAndGetFileURL(file).subscribe(url => this.loadedImageSubject$.next({ url, file }));
  }

  private async updateProfile(profileData: any): Promise<void> {
    return this.authService.updateProfile({
      displayName: profileData.username,
      email: profileData.email,
      password: profileData.password,
      photoURL: profileData.imageUrl
    }).then(() => {
      this.matSnackBar.open(`User's infos updated successfully`, 'Dismiss', { duration: 3000 });
      log.info(`User's infos updated successfully`);
    }).catch(err => {
      this.matSnackBar.open('An error happened while updating profile', 'Dismiss', { duration: 3000 });
      log.handleError(err);
    });
  }

  private async uploadStoredProfileImage(file: File): Promise<string | null> {
    if (file) {
      const uploadTask = this.storageService.uploadProfileImage(file, this.currentUser);
      return uploadTask
        .then(() => uploadTask.snapshot.ref.getDownloadURL())
        .then(downloadUrl => {
          log.info(`Profile image uploaded successfully.`);
          return downloadUrl;
        })
        .catch(err => {
          this.matSnackBar.open('An error happened while uploading profile image', 'Dismiss', { duration: 3000 });
          log.handleError(err);
        });
    } else {
      return new Promise(resolve => resolve(null));
    }
  }
}
