import { Component, OnInit, Input } from '@angular/core';

import { Logger } from '@app/core/services/logger.service';
import { PostsService } from '@app/core/services/posts.service';
import { UserComment } from '@app/core/models/user-comment.model';

const log = new Logger('Comments Component');

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  @Input() comments: UserComment[];
  @Input() palette: string;
  @Input() postId: number;

  constructor(private postService: PostsService) { }

  sendComment(text: string) {
    this.postService.postComment(text, this.postId).subscribe(comment => log.debug(comment));
  }
}
