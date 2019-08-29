import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { SettingsComponent } from './containers/settings/settings.component';
import { AboutComponent } from './components/about/about.component';


@NgModule({
  declarations: [ProfilePageComponent, SettingsComponent, AboutComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
