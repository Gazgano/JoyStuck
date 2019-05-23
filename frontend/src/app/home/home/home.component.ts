import { Component, OnInit } from '@angular/core';

import { PostsService } from '@app/core/services/posts.service';
import { Logger } from '@app/core/services/logger.service';
import { Post, PostTypeDesign, POST_TYPE_DESIGNS } from '@app/core/models/post.model';

const log = new Logger('HomeComponent');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts: Post[] = [];
  public postTypeDesign: PostTypeDesign;
  
  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts().subscribe(posts => {
      log.debug(posts);
      this.posts = posts;
    });
  }

  getPostDesign(post: Post): PostTypeDesign {
    return POST_TYPE_DESIGNS[post.type];
  }
}
