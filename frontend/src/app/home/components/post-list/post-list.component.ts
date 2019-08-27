import { Component, Input } from '@angular/core';
import { Post } from '@app/home/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  @Input() posts: Post[];

  constructor() { }

  trackByPost(index: number, post: Post) {
    return post.id;
  }
}