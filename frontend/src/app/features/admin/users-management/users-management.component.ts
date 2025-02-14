import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SearchService } from '../../../shared/services/search.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../core/services/admin/admin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { IUser } from '../../../shared/models/userModel';
import { selectAdminError, selectAdminLoading, selectAllUsers } from '../../../store/selectors/admin.selectors';
import * as AdminActions from '../../../store/actions/admin.actions';
import { UserDialogComponent } from '../../../shared/components/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MaterialModule, CommonModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent implements OnInit {
  displayedColumns: string[] = ['profileImage', 'name', 'email', 'phone', 'position', 'blockedStatus', 'actions'];
  dataSource = new MatTableDataSource<IUser>([]);
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  filterValue: string = '';
  profileImage = 'assets/icons/profile-user.png';
  length = 0; // Total number of items
  pageSize = 5; // Number of items per page
  pageIndex = 0; // Current page index
  pageSizeOptions = [5, 10, 20]; // Options for page size
  showFirstLastButtons = true; // Whether to show First/Last buttons on paginator

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private searchService: SearchService, private dialog: MatDialog, private adminService: AdminService, private notificationService: NotificationService) { }
  ngOnInit(): void {
    this.fetchUsers();
    // Listen for search query updates
    this.searchService.searchQuery$.subscribe((query) => {
      this.applyGlobalFilter(query);
    })

    // Bind loading and error state selectors to observables
    this.isLoading$ = this.store.select(selectAdminLoading);
    this.error$ = this.store.select(selectAdminError);

    // Custom filter
    this.dataSource.filterPredicate = (data: IUser, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(filterText) ||
        data.email.toLowerCase().includes(filterText) ||
        data.phone.toString().includes(filterText)
      );
    };

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchUsers(): void {
    this.store.dispatch(AdminActions.fetchUsers());

    this.store.select(selectAllUsers).subscribe((users) => {
      this.dataSource.data = users;
      this.length = users.length;
    })
  }

  applyGlobalFilter(filter: string): void {
    this.filterValue = filter;
    this.dataSource.filter = filter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserDialog(user: IUser | null = null, mode: string): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }


    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '1000px',
      data: { user, mode },
      disableClose: true,
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'edit') {
          this.updateUser(result);
        } else if (mode === 'add') {
          this.addUser(result);
        }
      }
    });
  }

  addUser(user: FormData): void {
    this.store.dispatch(AdminActions.addUser({ user }));
  }

  updateUser(user: FormData): void {
    this.store.dispatch(AdminActions.updateUser({ user }));
  }

  deleteUser(user: IUser): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        icon: 'warning',
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!user._id) {
          this.notificationService.showNotification('User session expired. Please login again.');
          return;
        }
        this.store.dispatch(AdminActions.deleteUser({ id: user._id }));
      }
    })
  }


  toggleBlockUser(user: IUser, event: Event): void {
    event.stopPropagation();
    const action = user.isBlocked ? 'unblock' : 'block';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        icon: 'warning',
        title: `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        message: `Are you sure you want to ${action} ${user.name}'s account?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!user._id) {
          this.notificationService.showNotification('User session expired. Please login again.');
          return;
        }
        this.adminService.toggleBlockUser(user._id).subscribe(
          (response: any) => {
            const updatedUser = { ...user, isBlocked: response.isBlocked };

            this.dataSource.data = this.dataSource.data.map(u =>
              u._id === updatedUser._id ? updatedUser : u
            );
            const status = updatedUser.isBlocked ? 'blocked' : 'unblocked';
            this.notificationService.showNotification(`User successfully ${status}.`, 'success');
          },
          () => {
            this.notificationService.showNotification('Failed to update user status');
          }
        );
      }
    })
  }


  verifyUser(user: IUser, event: Event): void {
    event.stopPropagation(); // Prevents row click event from opening the dialog

    if (!user._id) {
      this.notificationService.showNotification('User session expired. Please login again.');
      return;
    }

    this.adminService.verifyUser(user._id).subscribe(
      (response: { message: string, user: IUser }) => {
        // Ensure response contains updated user data
        if (response.user) {
          this.dataSource.data = this.dataSource.data.map(u =>
            u._id === user._id ? { ...u, isVerified: response.user.isVerified } : u
          );
          this.notificationService.showNotification(response.message);
        } else {
          this.notificationService.showNotification('Unexpected response from server.');
        }
      },
      (error) => {
        console.error('Error verifying user:', error);
        this.notificationService.showNotification('Failed to verify user');
      }
    );
  }

}
