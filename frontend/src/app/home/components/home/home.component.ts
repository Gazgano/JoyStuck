import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../../models/post.model';
import { selectPostsArray, selectIsLoading } from '../../store/home.reducer';
import * as homeActions from '../../store/home.actions';

const log = new Logger('HomeComponent');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts$ = this.store.pipe(select(selectPostsArray));
  public isLoading$ = this.store.pipe(select(selectIsLoading));

  constructor(private store: Store<Post[]>) { }

  ngOnInit() {
    this.store.dispatch(homeActions.loadPosts());
  }
}
