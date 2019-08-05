import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { openCloseTrigger } from './post.animation';
import { UserComment } from '../../models/user-comment.model';
import * as commentsActions from '../../store/comments.actions';
import { selectCommentsArray } from '@app/home/store/comments.reducer';

const log = new Logger('PostComponent');

enum PostType {
  Normal = 0,
  Light
}

interface PostDesign {
  readonly componentStyle: PostType;
  readonly palette: string;
  readonly icon: string;
}

const POST_TYPES_DESIGNS: { [key: string]: PostDesign } = {
  gameDiscover: {
    palette: 'warn',
    icon: 'videogame_asset',
    componentStyle: PostType.Normal
  },
  newMember: {
    palette: 'primary',
    icon: 'user',
    componentStyle: PostType.Light
  },
  screenshotShare: {
    palette: 'accent',
    icon: 'image',
    componentStyle: PostType.Normal
  }
};

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
  public commentsLoading = false;
  public commentsCount: number;


  public comments$: Observable<UserComment[]>;


  constructor(private postsService: PostsService, private store: Store<UserComment[]>) { }
  
  //////////////////////////////////////////
  // Initialisation
  //////////////////////////////////////////
  
  ngOnInit() {
    this.postDesign = POST_TYPES_DESIGNS[this.post.type];
    this.initTitle();
    this.elapsedTime = moment().diff(this.post.timestamp, 'minute') + ' min.';
    this.defineCommentsCount();

    this.comments$ = this.store.pipe(select(selectCommentsArray));
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

  //////////////////////////////////////////
  // Post
  //////////////////////////////////////////

  likePost() {
    this.postsService.likePost(this.post).subscribe();
  }
  
  //////////////////////////////////////////
  // Comments
  //////////////////////////////////////////

  toggleComments(postId: number) {
    if (!this.commentsOpen) {
      this.commentsOpen = !this.commentsOpen;
      this.store.dispatch(commentsActions.loadComments({ postId }));
    }
  }

  defineCommentsCount() {
    if (this.post.comments) {
      this.commentsCount = this.post.comments.length;
    } else {
      this.commentsCount = this.post.commentsCount;
    }
  }
}
