import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import * as homeSelectors from '../../store/home/home.selectors';
import * as homeActions from '../../store/home/home.actions';

const log = new Logger('HomeComponent');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts$: Observable<Post[]>;
  public isLoading$: Observable<boolean>;

  constructor(private store: Store<Post[]>) { }

  ngOnInit() {
    this.posts$ = this.store.pipe(select(homeSelectors.selectPostsArray));
    this.isLoading$ = this.store.pipe(select(homeSelectors.selectIsLoading));
    this.store.dispatch(homeActions.loadPosts());
  }
}
