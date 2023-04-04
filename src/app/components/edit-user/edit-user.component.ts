import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CoreUser } from 'src/app/model/core-user';
import { Role } from 'src/app/model/role';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { CompanyBranchService } from 'src/app/shared/company-branch.service';
import { DataServiceService } from 'src/app/shared/data-service.service';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  users?: CoreUser[] = [];
  selectedUser?: CoreUser;
  showProfileList = false;
  rolesSubscribtion?: Subscription;
  dico?: any = '';
  userRoles?: Role[];
  roleNames?: string[] = [];

  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertify: AlertifyService,
    public companyBranchService: CompanyBranchService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscribedUsers();
    this.getDico();
    this.getUserRoles();
  }
  hasPermission(roleName: string) {
    const index = this.roleNames?.indexOf(roleName);
    return index === -1;
  }

  getUserRoles() {
    const selectedProfile = localStorage.getItem('selectedProfile');

    this.dataService.getUserRoles(selectedProfile!).subscribe({
      next: (res) => {
        // this.userRoles = res.data;
        res.data?.forEach((res: any) => {
          this.roleNames?.push(res.id!);
        });
        // console.log(this.roleNames);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showProfList(selectedUser: CoreUser) {
    this.selectedUser = selectedUser;
    this.showProfileList = true;
  }

  openDialog(selectedUser: CoreUser): void {
    this.selectedUser = selectedUser;
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: {
        selectedUser: this.selectedUser,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.companyBranchService.getBranchId(result);
      this.companyBranchService.getCompanyId();
    });
  }

  subscribedUsers() {
    this.dataService.getUsers.subscribe({
      next: (data) => {
        const userName = data.userName!;
        const displayName = data.displayName!;
        this.userSearch(userName, displayName);
      },
    });
  }

  userSearch(username: string, name: string) {
    this.dataService.userSearch(username, name).subscribe({
      next: (res) => {
        this.users = res.data;
        // console.log(this.users);
      },
      error: (err) => {
        if (err.error === 'Token Expired') {
          this.authService.logout();
          console.log(err.error);
        }
      },
    });
  }

  editUserStatus(userId: string, active: number) {
    const activeStat = active === 0 ? 1 : 0;
    this.dataService.editUserStatus(userId, activeStat).subscribe({
      next: (res) => {
        this.alertify.success(res.title!);
        this.userSearch(userId, '');
      },
      error: (err) => {
        if (err.error === 'Token Expired') {
          this.authService.logout();
          console.log(err.error);
        }
      },
    });
  }

  resetPassword() {
    const userName = this.selectedUser?.userName!;
    this.alertify.confirmDialog(
      `Are You sure you want to reset user ${userName} password`,
      () => {
        this.dataService.resetPassword(userName).subscribe({
          next: (res) => {
            this.alertify.dialogAlert(res.title!);
            console.log(res);
          },
          error: (err) => {
            if (err.error === 'Token Expired') {
              this.authService.logout();
              console.log(err.error);
            }
          },
        });
      }
    );
  }

  getDico() {
    const language = localStorage.getItem('selectedLanguage')!;
    this.dataService.Dico(language).subscribe({
      next: (language) => {
        this.dico = language.data;
        // console.log(language.data);
      },
      error: (err) => {
        if (err.error === 'Token Expired') {
          this.authService.logout();
          console.log(err.error);
        }
      },
    });
  }
}
