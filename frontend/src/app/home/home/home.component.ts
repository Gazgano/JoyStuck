import { Component, OnInit } from '@angular/core';

import { PostsService } from '@app/core/services/posts.service';
import { Logger } from '@app/core/services/logger.service';
import { Post } from '@app/core/models/post.model';

const log = new Logger('HomeComponent');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts: Post[] = [];
  
  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts().subscribe(posts => {
      log.debug(posts);
      this.posts = posts;
    });
  }
}
