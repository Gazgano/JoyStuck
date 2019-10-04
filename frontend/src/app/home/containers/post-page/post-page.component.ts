import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import * as postSelectors from '../../store/post/post.selectors';
import * as postActions from '../../store/post/post.actions';
import { CallState, getErrorMessage } from '@app/core/models/call-state.model';
import { PostEditorType } from '@app/home/components/post-editor/post-editor.config';

const log = new Logger('PostPageComponent');

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostPageComponent implements OnInit {

  public posts$: Observable<Post[]>;
  public callState$: Observable<CallState>;
  public displayedEditor: PostEditorType;

  constructor(private store: Store<Post[]>) { }

  ngOnInit() {
    this.posts$ = this.store.pipe(select(postSelectors.selectPostsArray));
    this.callState$ = this.store.pipe(select(postSelectors.selectLoadPostsState));
    this.refresh();
  }

  refresh() {
    this.store.dispatch(postActions.loadPosts());
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

  closeEditor() {
    this.displayedEditor = null;
  }
}
