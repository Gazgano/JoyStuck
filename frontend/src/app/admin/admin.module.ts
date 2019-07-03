import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './services/admin.service';
import { SharedModule } from '@app/shared/shared.module';
import { UserListComponent } from './components/user-list/user-list.component';
import * as fromUserList from './store/user-list.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserListEffects } from './store/user-list.effects';

@NgModule({
  declarations: [ 
    AdminComponent, 
    AdminDashboardComponent ,
    UserListComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    StoreModule.forFeature('userList', fromUserList.reducer),
    EffectsModule.forFeature([UserListEffects])
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
