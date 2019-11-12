import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import { User } from '@app/core/models/user.model';
import { PostDesign, POST_TYPES_DESIGNS, PostAction } from './post.config';
import { openCloseTrigger } from './post.animation';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { FileService } from '@app/core/services/file.service';
import { HtmlFormatPipe } from '@app/shared/pipes/html-format.pipe';
import { CallState } from '@app/core/models/call-state.model';

const log = new Logger('PostComponent');

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [openCloseTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  @Input() currentUser: User;
  @Input() commentsCount$: Observable<number>;
  @Input() inDeletionState: CallState;
  @Output() action = new EventEmitter<PostAction>();

  public postDesign: PostDesign;
  public commentsOpen = false;
  public postAuthor: User;
  public postTimestamp: string;

  public images$: Observable<HTMLImageElement[]>;
  public maxPreviewsCount = 5; // SCSS (var $maxPreviewsCount) must be changed accordingly (@for loop)

  // font awesome icons
  public faBullhorn = faBullhorn;

  constructor(private matDialog: MatDialog, private fileService: FileService) { }

  ngOnInit() {
    this.postDesign = POST_TYPES_DESIGNS[this.post.type];
    this.postAuthor = {
      id: this.post.author.uid,
      username: this.post.author.displayName,
      profileImageSrcUrl: this.post.author.photoURL
    };
    this.postTimestamp = moment(this.post.timestamp).format('D MMM HH:mm');
    this.loadImages();
  }

  get elapsedTime(): string {
    return moment(this.post.timestamp).fromNow();
  }

  get htmlFormattedContent() {
    return (new HtmlFormatPipe()).transform(this.post.content);
  }

  get isInDeletion(): boolean {
    return this.inDeletionState == 'LOADING';
  }

  getPreviewsCount(imagesLength: number) {
    return Math.min(imagesLength, this.maxPreviewsCount);
  }

  toggleLikePost() {
    if (this.post.likeIds && this.post.likeIds.includes(this.currentUser.id)) {
      this.action.emit({ action: 'unlike', post: this.post });
    } else {
      this.action.emit({ action: 'like', post: this.post });
    }
  }

  toggleComments() {
    if (!this.commentsOpen) { this.loadComments(); }
    this.commentsOpen = !this.commentsOpen;
  }

  loadComments() {
    this.action.emit({ action: 'loadComments', post: this.post });
  }

  openImageViewer(images: HTMLImageElement[], index: number) {
    this.matDialog.open(ImageViewerComponent, {
      maxHeight: '90vh',
      data: { images, selectedImageIndex: index }
    });
  }

  deletePost() {
    this.action.emit({ action: 'delete', post: this.post });
  }

  private loadImages() {
    if (this.post.imagesStorageURLs && this.post.imagesStorageURLs.length > 0) {
      this.images$ = combineLatest(
        this.post.imagesStorageURLs.map(imageURL =>
          this.fileService.imageFromURL(imageURL)
        )
      ).pipe(
        catchError(err => {
          log.warn(`One of the images from Post '${this.post.id}' has not been found.`, err);
          return of(null);
        })
      );
    }
  }
}
