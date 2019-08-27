import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { UserComment } from '@app/home/models/user-comment.model';
import * as commentsSelectors from '@app/home/store/comments/comments.selectors';

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.scss']
})
export class CommentPageComponent implements OnInit {

  @Input() postId: string;
  @Input() palette: string;

  public areCommentsLoading$: Observable<boolean>;
  public comments$: Observable<UserComment[]>;

  constructor(private store: Store<UserComment[]>) { }

  ngOnInit() {
    this.areCommentsLoading$ = this.store.pipe(select(commentsSelectors.selectLoadingCommentsByPostId(this.postId)));
    this.comments$ = this.store.pipe(select(commentsSelectors.selectCommentsByPostId(this.postId)));
  }
}
