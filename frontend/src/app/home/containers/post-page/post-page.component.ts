import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import * as postSelectors from '../../store/post/post.selectors';
import * as postActions from '../../store/post/post.actions';

const log = new Logger('PostPageComponent');

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostPageComponent implements OnInit {

  public posts$: Observable<Post[]>;
  public isLoading$: Observable<boolean>;

  constructor(private store: Store<Post[]>) { }

  ngOnInit() {
    this.posts$ = this.store.pipe(select(postSelectors.selectPostsArray));
    this.isLoading$ = this.store.pipe(select(postSelectors.selectIsLoading));
    this.store.dispatch(postActions.loadPosts());
  }
}