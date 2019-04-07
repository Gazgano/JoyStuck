import { NgModule } from '@angular/core';

import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [ AdminComponent, UserListComponent, AdminDashboardComponent ],
  imports: [
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
