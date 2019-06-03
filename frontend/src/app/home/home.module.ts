import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsComponent } from './post/comments/comments.component';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostComponent } from './post/post.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [CommentsComponent, HomeComponent, PostComponent ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
