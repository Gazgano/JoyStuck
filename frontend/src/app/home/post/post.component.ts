import { Component, OnInit, Input } from '@angular/core';
import { Post } from '@app/core/models/post.model';

interface PostType {
  readonly color: string;
  readonly icon: string;
}

const POST_TYPES: { [key: string]: PostType } = {
  gameDiscover: {
    color: 'warn',
    icon: 'videogame_asset'
  },
  screenshotShare: {
    color: 'accent',
    icon: 'image'
  }
};

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  public title: string[];
  public postType: PostType;
  
  constructor() { }

  ngOnInit() {
    this.title = this.post.title.split(' ');
    this.postType = POST_TYPES[this.post.type];
  }
}
