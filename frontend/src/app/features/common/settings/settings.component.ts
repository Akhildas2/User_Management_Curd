import { Component, effect, Signal, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthServices } from '../../../core/services/auth/auth.services';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  changePasswordForm: FormGroup;
  hideCurrent = signal(true);
  hideNew = signal(true);
  hideConfirm = signal(true);
  theme: WritableSignal<string> = signal(localStorage.getItem('theme') || 'light');


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthServices,
    private notificationService: NotificationService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchPasswordValidator()]]
    });

    this.applyTheme(this.theme());
    effect(() => this.applyTheme(this.theme()));
  }


  toggleVisibility(field: string, event: MouseEvent) {
    event.preventDefault();

    switch (field) {
      case 'current':
        this.hideCurrent.set(!this.hideCurrent());
        break;
      case 'new':
        this.hideNew.set(!this.hideNew());
        break;
      case 'confirm':
        this.hideConfirm.set(!this.hideConfirm());
        break;
    }
  }

  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = this.changePasswordForm?.get('newPassword')?.value;
      const confirmPassword = control.value;

      if (!newPassword || !confirmPassword) {
        return null;
      }

      return newPassword !== confirmPassword ? { passwordMismatch: true } : null;
    };
  }



  changePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.notificationService.showNotification('New passwords do not match', 'error');
      return;
    }

    const id = this.authService.getUserId();
    if (!id) {
      this.notificationService.showNotification('User session expired. Please login again.');
      return;
    }
    this.userService.changePassword(id, currentPassword, newPassword).subscribe(
      (response) => {
        this.notificationService.showNotification('Password updated successfully!', 'success');
        this.changePasswordForm.reset();

        Object.keys(this.changePasswordForm.controls).forEach((key) => {
          this.changePasswordForm.get(key)?.setErrors(null);
          this.changePasswordForm.get(key)?.markAsPristine();
          this.changePasswordForm.get(key)?.markAsUntouched();
        });

      },
      (error) => {
        const errorMessage = error?.error?.message || 'Failed to update password. Please try again.';
        this.notificationService.showNotification(errorMessage, 'error');
      }
    )

  }
  changeTheme(theme: string) {
    this.theme.set(theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(theme: string) {
    document.body.classList.remove('light', 'dark'); // Remove old theme
    document.body.classList.add(theme);
  }


}
