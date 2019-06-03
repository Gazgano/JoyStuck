import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as moment from 'moment';

import { Post } from '@app/core/models/post.model';

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
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
      })),
      state('closed', style({
        borderColor: 'rgba(0, 0, 0, 0)',
        height: '0',
        padding: '0'
      })),
      transition('* => closed', [
        animate('200ms')
      ]),
      transition('* => open', [
        animate('200ms')
      ]),
    ]),
  ],
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  public title: string | string[];
  public isTitleArray: boolean;
  public postDesign: PostDesign;
  public elapsedTime: string;
  public commentsOpen  = false;

  constructor() { }

  ngOnInit() {
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

  toggleComments() {
    this.commentsOpen = !this.commentsOpen;
  }
}