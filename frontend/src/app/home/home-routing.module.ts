import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostPageComponent } from './containers/post-page/post-page.component';

const routes: Routes = [
  {
    path: '',
    component: PostPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
