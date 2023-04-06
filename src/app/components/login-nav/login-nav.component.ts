import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePassDialogComponent } from '../change-pass-dialog/change-pass-dialog.component';
// import { AuthService } from 'src/app/shared/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-nav',
  templateUrl: './login-nav.component.html',
  styleUrls: ['./login-nav.component.css'],
})
export class LoginNavComponent {
  userName?: string;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {
    this.userName = localStorage.getItem('username')!;
  }

  logout(): void {
    this.alertifyService.dialogAlert('User logged out successfully');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePassDialogComponent, {
      width: '25%',
    });
  }
}
