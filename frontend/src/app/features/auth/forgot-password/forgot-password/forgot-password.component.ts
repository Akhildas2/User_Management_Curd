import { Component } from '@angular/core';
import { AuthServices } from '../../../../core/services/auth/auth.services';
import { NotificationService } from '../../../../shared/services/notification.service';
import { MaterialModule } from '../../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = "";


  constructor(private authService: AuthServices, private notificationService: NotificationService) { }

  requestReset(): void {

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message, 'success');
      },
      error: (error) => {
        this.notificationService.showNotification(error.error.message, 'error');
      }
    })
  }
}
