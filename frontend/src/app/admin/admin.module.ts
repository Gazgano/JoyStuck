import { NgModule } from '@angular/core';

import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './services/admin.service';
import { SharedModule } from '@app/shared/shared.module';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [ 
    AdminComponent, 
    AdminDashboardComponent ,
    UserListComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
