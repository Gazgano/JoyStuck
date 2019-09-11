import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/core/services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { 
    path: 'home', 
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canLoad: [AuthGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canLoad: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
