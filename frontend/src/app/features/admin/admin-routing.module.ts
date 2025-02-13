import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { SettingsComponent } from '../common/settings/settings.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users-management', component: UsersManagementComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
