import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import { PostType, PostDesign, POST_TYPES_DESIGNS } from './post.config';
import { openCloseTrigger } from './post.animation';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments/comments.actions';
import * as commentsSelectors from '@app/home/store/comments/comments.selectors';
import * as homeActions from '../../store/home/home.actions';

const log = new Logger('PostComponent');

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [openCloseTrigger],
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  public title: string | string[];
  public isTitleArray: boolean;
  public postDesign: PostDesign;
  public elapsedTime: string;
  public commentsOpen = false;

  public comments$: Observable<UserComment[]>;
  public areCommentsLoading$: Observable<boolean>;

  constructor(private store: Store<UserComment[]>) { }

  //////////////////////////////////////////
  // Initialisation
  //////////////////////////////////////////

  ngOnInit() {
    this.comments$ = this.store.pipe(select(commentsSelectors.selectCommentsByPostId(this.post.id)));
    this.areCommentsLoading$ = this.store.pipe(select(commentsSelectors.selectLoadingCommentsByPostId(this.post.id)));
    
    this.postDesign = POST_TYPES_DESIGNS[this.post.type];
    this.initTitle();
    this.elapsedTime = moment().diff(this.post.timestamp, 'minute') + ' min.';
  }

  initTitle() {
    switch (this.postDesign.componentStyle) {
      case PostType.Normal:
        this.title = this.post.title.split(' ');
        this.isTitleArray = true;
        break;
      default:
        this.title = this.post.title;
        this.isTitleArray = false;
    }
  }

  likePost() {
    const id = this.post.id;
    this.store.dispatch(homeActions.likePost({ id }));
  }

  toggleComments() {
    const postId = this.post.id;
    
    if (!this.commentsOpen) {
      this.store.dispatch(commentsActions.loadComments({ postId }));
    }
    this.commentsOpen = !this.commentsOpen;
  }
}
