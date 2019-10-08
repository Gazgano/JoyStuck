import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as uid from 'uid';
import * as moment from 'moment';

import { User } from '@app/core/models/user.model';
import { AuthService } from '@app/core/services/auth.service';
import { PostEditorType, PostEditorDesign, POST_EDITOR_TYPES_DESIGNS } from './post-editor.config';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';
import { Post } from '@app/home/models/post.model';
import * as postActions from '@app/home/store/post/post.actions';
import * as postSelectors from '@app/home/store/post/post.selectors';
import { Observable, Subscription } from 'rxjs';
import { CallState } from '@app/core/models/call-state.model';
import { Actions, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('PostEditorComponent');

interface Image {
  url: ArrayBuffer | string;
  sizeInBytes: number;
  title: string;
}

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit, OnDestroy {

  @Input() postEditorType: PostEditorType;
  @Output() close = new EventEmitter<boolean>();
  @ViewChild('imageUploader', { static: true }) filesInput: ElementRef;

  public sendPostState$: Observable<CallState>;
  public sendPostSuccessAction$: Observable<any>;
  private sendPostSuccessActionSubscription: Subscription;
  
  public currentUser: User;
  
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

  private maxImageSizeInBytes = Math.pow(2, 21); // 2 MB
  public maxImageSizeString = Math.round(Math.pow(this.maxImageSizeInBytes, 1/21)) + ' MB';
  public images: Image[] = [];
  
  constructor(
    private authService: AuthService, 
    private formService: FormService,
    private store: Store<Post[]>,
    private actions$: Actions,
    private cd: ChangeDetectorRef,
    private matSnackBar: MatSnackBar 
  ) { }

  ngOnInit() {
    this.sendPostState$ = this.store.pipe(select(postSelectors.selectSendPostState));
    this.currentUser = this.authService.getCurrentUser();
    this.form = this.initializeForm();
    this.sendPostSuccessActionSubscription = this.closeEditorOnSuccess();
  }

  get design(): PostEditorDesign {
    return this.postEditorType? 
      POST_EDITOR_TYPES_DESIGNS[this.postEditorType]:
      POST_EDITOR_TYPES_DESIGNS.message;
  }

  readFiles() {
    this.images = [];
    
    const files: FileList = this.filesInput.nativeElement.files;
    if (files.length === 0) { return; }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      // format control
      if (files[i].type.match(/image\/*/) == null) {
        this.matSnackBar.open(`Only images are supported`, 'Dismiss', { duration: 3000 });
        return;
      }

      // size control
      if (files[i].size >= this.maxImageSizeInBytes) {
        this.matSnackBar.open(
          `Provided image is too big. Maximum size is ${this.maxImageSizeString}`, 
          'Dismiss', 
          { duration: 3000 }
        );
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(files[i]); 
      reader.onloadend = event => { 
        this.images.push({
          title: files[i].name,
          url: reader.result,
          sizeInBytes: files[i].size
        });
        this.refreshView();
      };
    }
    
    return;
  }

  getErrorMessage(path: string | string[], fieldName: string) {
    return this.formService.getErrorMessage(this.form, path, this.errorsMessages, fieldName);
  }

  closeEditor() {
    this.close.emit(true);
    this.form.reset();
    this.formSubmitted = false;
  }

  publish() {
    this.form.markAllAsTouched();
    this.formSubmitted = true;
    
    if (this.form.valid) {
      const title = this.form.get('title').value.trim();
      const message = this.form.get('message').value;
      const pendingPost = this.createPendingPost(title, message);
      this.store.dispatch(postActions.sendPost({ pendingPost }));
    }
  }

  refreshView() {
    this.cd.detectChanges();
  }

  private initializeForm(): FormGroup {
    return new FormGroup({
      // we use the regexp constructor in order to avoid a global control (we want to stop on the first match)
      title: new FormControl(null, [Validators.required, Validators.pattern(new RegExp('\\S+'))]),
      message: new FormControl(null, [Validators.required, Validators.pattern(new RegExp('\\S+'))])
    });
  }

  private closeEditorOnSuccess(): Subscription {
    return this.actions$
    .pipe(ofType(postActions.sendPostSuccess))
    .subscribe(() => this.closeEditor());
  }
  
  private createPendingPost(title: string, message: string): Post {
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
      content: message
    };
  }

  ngOnDestroy() {
    this.sendPostSuccessActionSubscription.unsubscribe();
  }
}
