import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import { User } from '@app/core/models/user.model';
import { PostDesign, POST_TYPES_DESIGNS } from './post.config';
import { openCloseTrigger } from './post.animation';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments/comments.actions';
import * as commentsSelectors from '../../store/comments/comments.selectors';
import * as postActions from '../../store/post/post.actions';
import { AuthService } from '@app/core/services/auth.service';

const log = new Logger('PostComponent');

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [openCloseTrigger],
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  public postDesign: PostDesign;
  public commentsOpen = false;
  public commentsCount$: Observable<number>;
  public currentUser: User;
  public previews: { url: string, dimensionsRate: number }[] = [];
  private maxPreviewsCount = 5; // SCSS must be changed accordingly (@for loop)
  
  // font awesome icons
  public author: User;
  public faBullhorn = faBullhorn;

  constructor(private store: Store<UserComment[]>, private authService: AuthService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.postDesign = POST_TYPES_DESIGNS[this.post.type];
    this.commentsCount$ = this.store.pipe(select(commentsSelectors.selectCommentsCountByPostId(this.post.id)));
    this.author = {
      id: this.post.author.uid,
      username: this.post.author.displayName,
      profileImageSrcUrl: this.post.author.photoURL
    };
    this.currentUser = this.authService.getCurrentUser();
    this.loadImages();
  }

  get elapsedTime(): string {
    return moment(this.post.timestamp).fromNow();
  }

  toggleLikePost() {
    if (this.post.likeIds && this.post.likeIds.includes(this.currentUser.id)) {
      this.store.dispatch(postActions.unlikePost({ post: this.post, currentUserId: this.currentUser.id }));
    } else {
      this.store.dispatch(postActions.likePost({ post: this.post, currentUserId: this.currentUser.id }));
    }
  }

  toggleComments() {
    if (!this.commentsOpen) { this.loadComments(); }
    this.commentsOpen = !this.commentsOpen;
  }

  loadComments() {
    this.store.dispatch(commentsActions.loadComments({ postId: this.post.id }));
  }

  private loadImages() {
    if (this.post.imagesStorageURLs) {
      this.post.imagesStorageURLs.forEach((imageURL, index) => {
        if (index < this.maxPreviewsCount) {
          const img = new Image();
          
          img.onload = () => {
            const image = {
              url: imageURL,
              dimensionsRate: img.width / img.height
            };
            this.previews.push(image);
            this.cd.detectChanges();
          };
          img.onerror = () => log.warn(`One of the images from Post '${this.post.id}' has not been found.`, imageURL);

          img.src = imageURL;
        }
      });
    }
  }
}
