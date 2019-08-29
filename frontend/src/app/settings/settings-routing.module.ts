import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { SettingsComponent } from './containers/settings/settings.component';

const routes: Routes = [
  { 
    path: '', 
    component: SettingsComponent,
    children: [
      { path: 'profile', component: ProfilePageComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
