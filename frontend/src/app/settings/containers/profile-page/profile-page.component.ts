import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';

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
export class ProfilePageComponent implements OnInit, OnDestroy {

  @ViewChild('file') fileInput: ElementRef;

  public currentUser: User;
  public isSubmitting = false;
  public isAdmin = false;

  private submissionSubject$ = new Subject<boolean>();
  public submission$ = this.submissionSubject$.asObservable();

  private loadedImageSubject$ = new BehaviorSubject<any>(null);
  public loadedImage$ = this.loadedImageSubject$.asObservable();

  private readFileServiceSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser.roles && this.currentUser.roles.includes('admin');
  }

  cleanFileInput() { // reset the file input and display current user's image
    this.fileInput.nativeElement.value = '';
    this.loadedImageSubject$.next(null);
  }

  deleteProfileImage() { // delete user's current image
    this.fileInput.nativeElement.value = '';
    this.loadedImageSubject$.next({ file: null, url: null });
  }

  submitForm() {
    this.submissionSubject$.next(true);
  }

  onChildFormSubmitAnswer(profileData: any) {
    /* If loadedImageSubject last value is null (initial value), then we don't update the profile image.
       If it's { file: null, url: null }, we delete it (user deleted it). Otherwise ({ file: ..., url: ... }), we update it.
    */
    this.isSubmitting = true;
    const lastLoadedImage = this.loadedImageSubject$.getValue();
    let updatingProfilePromise: Promise<any>;

    if (lastLoadedImage === null) {
      updatingProfilePromise = this.updateProfile({ ...profileData });
    } else if (lastLoadedImage.file === null) {
      updatingProfilePromise = this.updateProfile({...profileData, imageUrl: null });
    } else {
      updatingProfilePromise = this.storageService.uploadProfileImage(lastLoadedImage.file, this.currentUser)
      .toPromise()
      .then(upload => this.updateProfile({...profileData, imageUrl: upload.storageURL }));
    }

    updatingProfilePromise.finally(() => {
      this.isSubmitting = false;
      this.submissionSubject$.next(false);
    });
  }

  readFile() {
    const file = this.fileInput.nativeElement.files[0];
    this.readFileServiceSubscription = this.fileService.readAndGetFileURL(file)
    .subscribe(url => this.loadedImageSubject$.next({ url, file }));
  }

  private async updateProfile(profileData: any): Promise<void> {
    return this.authService.updateProfile({
      displayName: profileData.displayName,
      email: profileData.email,
      password: profileData.password,
      photoURL: profileData.imageUrl
    });
  }

  ngOnDestroy() {
    if (this.readFileServiceSubscription) {
      this.readFileServiceSubscription.unsubscribe();
    }
  }
}
