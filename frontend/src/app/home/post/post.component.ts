import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { Post } from '@app/core/models/post.model';
import { isArray } from 'util';

enum PostType {
  Normal = 0,
  Light
}

interface PostDesign {
  readonly componentStyle: PostType;
  readonly color: string;
  readonly icon: string;
}

const POST_TYPES_DESIGNS: { [key: string]: PostDesign } = {
  gameDiscover: {
    color: 'warn',
    icon: 'videogame_asset',
    componentStyle: PostType.Normal
  },
  newMember: {
    color: 'primary',
    icon: 'user',
    componentStyle: PostType.Light
  },
  screenshotShare: {
    color: 'accent',
    icon: 'image',
    componentStyle: PostType.Normal
  }
};

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  public title: string | string[];
  public isTitleArray: boolean;
  public postDesign: PostDesign;
  public elapsedTime: string;
  
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
}
