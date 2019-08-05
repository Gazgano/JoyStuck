import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CommentsComponent } from './components/comments/comments.component';
import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostComponent } from './components/post/post.component';
import { SharedModule } from '@app/shared/shared.module';
import { reducersMap } from './store/';
import { HomeEffects } from './store/home.effects';
import { CommentsEffects } from './store/comments.effects';
import { PostsService } from './services/posts.service';
import { CommentsService } from './services/comments.service';

@NgModule({
  declarations: [CommentsComponent, HomeComponent, PostComponent ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    StoreModule.forFeature('home', reducersMap),
    EffectsModule.forFeature([HomeEffects, CommentsEffects])
  ],
  providers: [PostsService, CommentsService]
})
export class HomeModule { }
