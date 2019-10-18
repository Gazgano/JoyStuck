import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import * as postsSelectors from '../../store/post/post.selectors';
import * as postsActions from '../../store/post/post.actions';
import * as commentsSelectors from '../../store/comments/comments.selectors';
import * as commentsActions from '../../store/comments/comments.actions';
import { CallState, getErrorMessage } from '@app/core/models/call-state.model';
import { PostEditorType } from '@app/home/components/post-editor/post-editor.config';
import { PostAction } from '@app/home/components/post/post.config';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';
import { PostEditorAction } from '@app/home/components/post-editor/post-editor.config';

const log = new Logger('PostPageComponent');

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostPageComponent implements OnInit {

  public posts$: Observable<Post[]>;
  public loadingState$: Observable<CallState>;
  public sendPostState$: Observable<CallState>;
  public sendPostSuccessAction$: Observable<any>;
  public displayedEditor: PostEditorType;
  public currentUser: User;

  constructor(private store: Store<Post[]>, private authService: AuthService, private actions$: Actions) { }

  ngOnInit() {
    this.posts$ = this.store.pipe(select(postsSelectors.selectPostsArray));
    this.loadingState$ = this.store.pipe(select(postsSelectors.selectLoadPostsState));
    this.sendPostState$ = this.store.pipe(select(postsSelectors.selectSendPostState));
    this.sendPostSuccessAction$ = this.actions$.pipe(ofType(postsActions.sendPostSuccess));
    this.currentUser = this.authService.getCurrentUser();
    this.refresh();
  }

  refresh() {
    this.store.dispatch(postsActions.loadPosts());
  }

  getErrorMessage(callState: CallState): string {
    return getErrorMessage(callState);
  }

  toggleEditor(editorType: PostEditorType) {
    if (this.displayedEditor === editorType) {
      this.displayedEditor = null;
    } else {
      this.displayedEditor = editorType || null;
    }
  }

  getCommentsCount$(postId: string): Observable<number> {
    return this.store.pipe(select(commentsSelectors.selectCommentsCountByPostId(postId)));
  }

  onPostAction(postAction: PostAction | PostEditorAction) {
    switch (postAction.action) {
      case 'like':
        this.store.dispatch(postsActions.likePost({ post: postAction.post, currentUserId: this.currentUser.id }));
        break;
      case 'unlike':
        this.store.dispatch(postsActions.unlikePost({ post: postAction.post, currentUserId: this.currentUser.id }));
        break;
      case 'loadComments':
        this.store.dispatch(commentsActions.loadComments({ postId: postAction.post.id }));
        break;
      case 'sendPost':
        this.store.dispatch(postsActions.sendPost({ pendingPost: postAction.post }));
        break;
      case 'closeEditor':
        this.displayedEditor = null;
        break;
    }
  }

  trackByPost(index: number, post: Post) {
    return post.id;
  }
}
