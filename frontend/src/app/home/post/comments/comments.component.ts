import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

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
  @ViewChild('userComment') userCommentInput: ElementRef;
  public sendCommentLoading = false;

  constructor(private postService: PostsService) { }

  sendComment(text: string) {
    if (text.trim().length > 0) {
      this.sendCommentLoading = true;
      
      this.postService.postComment(text, this.postId).subscribe(comment => {
        log.debug(comment);
        
        if (comment) {
          this.comments.push(comment);
          this.userCommentInput.nativeElement.value = '';
        }

        this.sendCommentLoading = false;
      });
    }
  }

  likeComment(commentId: number) {
    const comment = this.comments.find(com => com.id === commentId);
    this.postService.likeComment(comment);
  }
}
