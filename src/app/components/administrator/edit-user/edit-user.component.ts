import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CoreUser } from 'src/app/model/core-user';
import { Role } from 'src/app/model/role';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { EditUserDialogComponent } from '../update-dialogs/edit-user-dialog/edit-user-dialog.component';
import { Router } from '@angular/router';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

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
  dico?: any;
  roleNames?: string[] = [];
  reportDateTimeFormat?: string;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertify: AlertifyService,
    public companyBranchService: CompanyBranchService,
    private authService: AuthService,
    private userRolesService: UsersRolesService,
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.subscribedUsers();
    this.getDico();
    this.dateFormatterService();
    this.userRolesService.getUserRoles();
  }
  dateFormatterService() {
    this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
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
      width: '900px',
      maxHeight: '800px',
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
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertify.dialogAlert('Error');
        }
      },
    });
  }

  userSearch(username: string, name: string) {
    this.showProfileList = false;
    this.dataService.userSearch(username, name).subscribe({
      next: (res) => {
        this.users = res.data;
        console.log(this.users);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertify.dialogAlert('Error');
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
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertify.dialogAlert('Error');
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
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertify.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  // getDico() {
  //   const language = localStorage.getItem('selectedLanguage')!;
  //   this.dataService.Dico(language).subscribe({
  //     next: (language) => {
  //       this.dico = language.data;
  //       // console.log(language.data);
  //     },
  //     error: (err) => {
  //       if (err.status === 401 || err.status === 500) {
  //         this.authService.logout();
  //         this.alertify.dialogAlert('Error');
  //       }
  //     },
  //   });
  // }
}
