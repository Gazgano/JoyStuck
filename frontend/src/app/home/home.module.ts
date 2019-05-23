import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { PostComponent } from './post/post.component';
import { PostLightComponent } from './post-light/post-light.component';

@NgModule({
  declarations: [HomeComponent, PostComponent, PostLightComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
