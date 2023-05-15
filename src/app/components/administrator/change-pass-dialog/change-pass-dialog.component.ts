import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-pass-dialog',
  templateUrl: './change-pass-dialog.component.html',
  styleUrls: ['./change-pass-dialog.component.css'],
})
export class ChangePassDialogComponent implements OnInit {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  constructor(
    private dialogRef: MatDialogRef<ChangePassDialogComponent>,
    private dataService: DataServiceService,
    private alertify: AlertifyService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  changePassword() {
    const currentPassword = this.currentPassword!;
    const newPassword = this.newPassword!;

    this.alertify.confirmDialog(
      'Are you sure you want to change your password',
      () => {
        this.dataService
          .changePassword(currentPassword, newPassword)
          .subscribe({
            next: (res) => {
              if (res.statusCode === 200) {
                this.alertify.dialogAlert(res.title!);
                this.router.navigate(['/login']);
                this.dialogRef.close();
                localStorage.removeItem('token');
                console.log(res);
              } else {
                this.alertify.error(res.title!);
              }
            },
            error: (err) => {
              if (err.status === 401 || err.status === 500) {
                this.authService.logout();
                this.alertify.dialogAlert('Error');
              }
            },
          });
      }
    );
  }
}
