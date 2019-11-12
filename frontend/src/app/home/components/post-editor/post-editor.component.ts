import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { tap, takeLast, map } from 'rxjs/operators';
import * as uid from 'uid';
import * as moment from 'moment';

import { User } from '@app/core/models/user.model';
import { PostEditorType, PostEditorDesign, POST_EDITOR_TYPES_DESIGNS, PostEditorAction } from './post-editor.config';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';
import { Post } from '@app/home/models/post.model';
import { CallState } from '@app/core/models/call-state.model';
import { ImagesPreviewerComponent } from '@app/shared/components/images-previewer/images-previewer.component';
import { StorageService } from '@app/core/services/storage.service';

const log = new Logger('PostEditorComponent');

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostEditorComponent implements OnInit, OnDestroy {

  @Input() postEditorType: PostEditorType;
  @Input() currentUser: User;
  @Input() sendPostState$: Observable<CallState>;
  @Input() sendPostSuccessAction$: Observable<any>;

  @Output() action = new EventEmitter<PostEditorAction>();

  @ViewChild('imagesPreviewer', { static: false }) imagesPreviewer: ImagesPreviewerComponent;

  private sendPostSuccessActionSubscription: Subscription;

  public form: FormGroup;
  public formSubmitted = false;
  private errorsMessages = {
    title: {
      required: (fieldName: string) => `${fieldName} is required`,
      pattern: (fieldName: string) => `${fieldName} contains only spaces`
    },
    message: {
      required: (fieldName: string) => `${fieldName} is required`,
      pattern: (fieldName: string) => `${fieldName} contains only spaces`
    }
  };

  public maxImageSizeInBytes = 4*Math.pow(2, 20); // 4 MB

  constructor(private formService: FormService, private storageService: StorageService) { }

  ngOnInit() {
    this.form = this.initializeForm();
    this.closeEditorOnSuccess();
  }

  get design(): PostEditorDesign {
    return this.postEditorType?
      POST_EDITOR_TYPES_DESIGNS[this.postEditorType]:
      POST_EDITOR_TYPES_DESIGNS.message;
  }

  getErrorMessage(path: string | string[], fieldName: string) {
    return this.formService.getErrorMessage(this.form, path, this.errorsMessages, fieldName);
  }

  closeEditor() {
    this.action.emit({ action: 'closeEditor' });
    this.form.reset();
    this.formSubmitted = false;
    this.imagesPreviewer.deleteAllFiles();
  }

  publish() {
    this.form.markAllAsTouched();
    this.formSubmitted = true;

    if (this.form.valid) {
      this.uploadImages().then(imagesStorageURLs => {
        const title = this.form.get('title').value.trim();
        const message = this.form.get('message').value;
        const pendingPost = this.createPendingPost(title, message, imagesStorageURLs);
        this.action.emit({ action: 'sendPost', post: pendingPost });
      });
    }
  }

  private initializeForm(): FormGroup {
    return new FormGroup({
      // we use the regexp constructor in order to avoid a global control (we want to stop on the first match)
      title: new FormControl(null, [Validators.required, Validators.pattern(new RegExp('\\S+'))]),
      message: new FormControl(null, Validators.pattern(new RegExp('\\S+')))
    });
  }

  private async uploadImages(): Promise<string[]> {
    if (!this.imagesPreviewer.images || this.imagesPreviewer.images.length === 0) {
      return Promise.resolve([]);
    }

    // we call the upload service for each image
    const postImageUploads$ = this.imagesPreviewer.images.map(image =>
      this.storageService.uploadPostImage(image.file).pipe(
        tap(upload => { // refresh progress on view
          image.uploadProgress = upload.uploadProgress;
          this.imagesPreviewer.refreshView();
        })
      )
    );

    // when all images are uploaded, we return the result URLs array
    return forkJoin(postImageUploads$).pipe(
      takeLast(1),
      map(uploadResults => uploadResults.map(upload => upload.storageURL))
    ).toPromise();
  }

  private closeEditorOnSuccess() {
    this.sendPostSuccessActionSubscription = this.sendPostSuccessAction$.subscribe(() => this.closeEditor());
  }

  private createPendingPost(title: string, message: string, imagesStorageURLs: string[]): Post {
    return {
      id: uid(20),
      timestamp: moment().format(),
      type: this.postEditorType,
      author: {
        uid: this.currentUser.id,
        displayName: this.currentUser.username,
        photoURL: this.currentUser.profileImageSrcUrl
      },
      title,
      likeIds: [],
      commentsCount: 0,
      content: message,
      imagesStorageURLs
    };
  }

  ngOnDestroy() {
    this.sendPostSuccessActionSubscription.unsubscribe();
  }
}
