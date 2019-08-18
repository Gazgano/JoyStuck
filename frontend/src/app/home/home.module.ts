import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CommentsComponent } from './components/comments/comments.component';
import { PostPageComponent } from './containers/post-page/post-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostComponent } from './components/post/post.component';
import { SharedModule } from '@app/shared/shared.module';
import { reducersMap } from './store/';
import { PostEffects } from './store/post/post.effects';
import { CommentsEffects } from './store/comments/comments.effects';
import { PostsService } from './services/posts.service';
import { CommentsService } from './services/comments.service';
import { PostListComponent } from './components/post-list/post-list.component';

@NgModule({
  declarations: [CommentsComponent, PostPageComponent, PostComponent, PostListComponent ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    StoreModule.forFeature('home', reducersMap),
    EffectsModule.forFeature([PostEffects, CommentsEffects])
  ],
  providers: [PostsService, CommentsService]
})
export class HomeModule { }
