import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ AdminComponent ],
  imports: [
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
