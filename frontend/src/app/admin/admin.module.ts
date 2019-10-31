import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [ 
    AdminComponent, 
    AdminDashboardComponent,
    UserListComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
