import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../../models/user-comment.model';
import { User } from '@app/core/models/user.model';
import * as moment from 'moment';
import { Palette } from '@app/core/models/palette.model';

const log = new Logger('CommentComponent');

export interface CommentAction {
  action: 'like' | 'unlike' | 'resend' | 'delete';
  comment: UserComment;
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent implements OnInit {

  @Input() comment: UserComment;
  @Input() palette: Palette;
  @Input() currentUser: User;

  @Output() action = new EventEmitter<CommentAction>();

  public author: User;
  public timestamp: string;
  public menuOpen = false;

  constructor() { }

  ngOnInit() {
    this.author = {
      id: this.comment.author.uid,
      username: this.comment.author.displayName,
      profileImageSrcUrl: this.comment.author.photoURL
    };
    this.timestamp = moment(this.comment.timestamp).format('D MMM HH:mm');
  }

  get canDelete(): boolean {
    return this.author.id == this.currentUser.id || this.currentUser.roles && this.currentUser.roles.includes('admin');
  }

  toggleLikeComment() {
    if (this.comment.likeIds && this.comment.likeIds.includes(this.currentUser.id)) {
      this.action.emit({ action: 'unlike', comment: this.comment });
    } else {
      this.action.emit({ action: 'like', comment: this.comment });
    }
  }

  deleteComment() {
    this.action.emit({ action: 'delete', comment: this.comment });
  }

  retrySend() {
    this.action.emit({ action: 'resend', comment: this.comment });
  }
}
