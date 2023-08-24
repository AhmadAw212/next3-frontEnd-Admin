import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-change-pass-dialog',
  templateUrl: './change-pass-dialog.component.html',
  styleUrls: ['./change-pass-dialog.component.css'],
})
export class ChangePassDialogComponent implements OnInit {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  dico?: any;
  constructor(
    private dialogRef: MatDialogRef<ChangePassDialogComponent>,
    private dataService: DataServiceService,
    private alertify: AlertifyService,
    private router: Router,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  changePassword() {
    const currentPassword = this.currentPassword!;
    const newPassword = this.newPassword!;
    this.alertify.confirmDialog(
      'Are you sure you want to change your password ? ',
      () => {
        this.dataService
          .changePassword(currentPassword, newPassword)
          .subscribe({
            next: (res) => {
              if (res.statusCode === 505) {
                this.alertify.error(res.title);
              } else if (res.statusCode === 200 || res.statusCode === 201) {
                this.alertify.success(res.title);
                this.router.navigate(['/login']);
                localStorage.removeItem('token');
                this.dialogRef.close();
              }
              // console.log(res);
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    );
  }
}
