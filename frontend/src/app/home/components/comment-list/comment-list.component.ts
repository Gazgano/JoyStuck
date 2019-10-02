import { Component,Input } from '@angular/core';

import { UserComment } from '@app/home/models/user-comment.model';
import { Palette } from '@app/core/models/palette.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent {

  @Input() comments: UserComment[];
  @Input() palette: Palette;
  @Input() postId: string;

  constructor() { }

  trackByComment(index: number, comment: UserComment) {
    return comment.id;
  }
}
