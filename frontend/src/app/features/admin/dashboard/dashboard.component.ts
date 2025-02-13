import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as AdminActions from '../../../store/actions/admin.actions';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../../../store/selectors/admin.selectors';
import { IUser } from '../../../shared/models/userModel';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MaterialModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalUser = 0;
  blockedUser = 0;
  verifiedUser = 0;
  activeUser = 0;

  metrics = [
    { title: 'Total Users', value: 0, icon: 'people', color: '#004d63' },
    { title: 'Active Users', value: 0, icon: 'person', color: '#00adbd' },
    { title: 'Blocked Users', value: 0, icon: 'block', color: '#FF0000' },
    { title: 'Verified Users', value: 0, icon: 'verified', color: '#4CAF50' },
  ];

  quickActions = [
    { title: 'Manage Users', icon: 'people', route: '/admin/users-management' },
    { title: 'Profile', icon: 'person', route: '/admin/profile' },
    { title: 'Settings', icon: 'settings', route: '/admin/settings' },
  ];

  constructor(private store: Store, private router: Router) {
    this.store.dispatch(AdminActions.fetchUsers());

    this.store.select(selectAllUsers).subscribe((users: IUser[]) => {
      this.totalUser = users.length;
      this.blockedUser = users.filter(user => user.isBlocked).length;
      this.verifiedUser = users.filter(user => user.isVerified).length;
      this.activeUser = this.totalUser - this.blockedUser;
      this.metrics = [
        { title: 'Total Users', value: this.totalUser, icon: 'people', color: '#004d63' },
        { title: 'Active Users', value: this.activeUser, icon: 'person', color: '#00adbd' },
        { title: 'Blocked Users', value: this.blockedUser, icon: 'block', color: '#FF0000' },
        { title: 'Verified Users', value: this.verifiedUser, icon: 'verified', color: '#4CAF50' },
      ];
    });
  }


  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
