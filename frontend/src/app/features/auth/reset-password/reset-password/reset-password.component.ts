import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../Material.Module';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../../../core/services/auth/auth.services';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = "";
  token: string = "";
  hidePassword: boolean = true;


  constructor(private authService: AuthServices, private notificationService: NotificationService, private router: Router, private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') || "";
  }


  toggleVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  resetPassword(): void {
    if (!this.newPassword.trim()) {
      this.notificationService.showNotification("Password cannot be empty", "error");
      return;
    }

    if (this.newPassword.length < 6) {
      this.notificationService.showNotification("Password must be at least 6 characters", "error");
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message, 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.notificationService.showNotification(error.error.message, 'error')
      }
    })
  }

}
