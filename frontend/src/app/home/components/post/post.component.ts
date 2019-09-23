import { Component, OnInit, Input } from '@angular/core';
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
  public author: User;
  public faBullhorn = faBullhorn;
  public currentUser: User;

  constructor(private store: Store<UserComment[]>, private authService: AuthService) { }

  ngOnInit() {
    this.postDesign = POST_TYPES_DESIGNS[this.post.type];
    this.commentsCount$ = this.store.pipe(select(commentsSelectors.selectCommentsCountByPostId(this.post.id)));
    this.author = {
      id: this.post.author.uid,
      username: this.post.author.displayName,
      profileImageSrcUrl: this.post.author.photoURL
    };
    this.currentUser = this.authService.getCurrentUser();
  }

  get elapsedTime(): string {
    return moment(this.post.timestamp).fromNow();
  }

  likePost() {
    const id = this.post.id;
    this.store.dispatch(postActions.likePost({ id }));
  }

  toggleComments() {
    const postId = this.post.id;

    if (!this.commentsOpen) {
      this.store.dispatch(commentsActions.loadComments({ postId }));
    }
    this.commentsOpen = !this.commentsOpen;
  }
}
