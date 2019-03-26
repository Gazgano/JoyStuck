import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SystemComponent } from './system.component';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  declarations: [SystemComponent],
  imports: [
    SharedModule,
    SystemRoutingModule
  ]
})
export class SystemModule { }
