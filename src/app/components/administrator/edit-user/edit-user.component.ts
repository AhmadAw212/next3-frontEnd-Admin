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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { type } from 'src/app/model/type';
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
  selectedRow!: HTMLElement;
  dateFormats?: any;
  userName?: string = '';
  private searchTimer: any;
  roles?: type[];
  selectedRole: string = '';
  username: string = '';
  name: string = '';
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertify: AlertifyService,
    public companyBranchService: CompanyBranchService,
    private authService: AuthService,
    private userRolesService: UsersRolesService,
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService,
    private datePipe: DatePipe
  ) {
    this.userName = this.selectedUser?.userName!;
  }

  ngOnInit(): void {
    this.subscribedUsers();
    this.getDico();
    this.dateFormatterService();
    this.userRolesService.getUserRoles();
  }
  highlightRow(event: Event) {
    const clickedField = event.target as HTMLElement;
    const clickedRow = clickedField.closest('tr') as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow;
    this.selectedRow.classList.add('highlight');
  }
  exportToExcel() {
    const data = this.users?.map((user) => {
      return {
        'User Name': user.userName,
        'Display Name': user.displayName,
        Email: user.email,
        Company: user.companyDescription,
        Active: user.activeDesc,
        'Created Date': this.datePipe.transform(
          user.sysCreatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Created By': user.sysCreatedBy,
        'Updated Date': this.datePipe.transform(
          user.sysUpdatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': user.sysUpdatedBy,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Users.xlsx');
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  searchRoles(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const name = event.term;
      this.dataService.searchRoles(name).subscribe({
        next: (res) => {
          this.roles = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertify.error(err.error.message);
          console.log(err);
        },
      });
    }, 300);
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
        dico: this.dico,
      },
      width: '900px',
      maxHeight: '500px',
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
        this.userSearch();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          // this.authService.logout();
          this.alertify.dialogAlert('Error');
        }
      },
    });
  }

  userSearch() {
    this.showProfileList = false;
    this.dataService
      .userSearch(this.username!, this.name!, this.selectedRole!)
      .subscribe({
        next: (res) => {
          this.users = res.data;
          // console.log(this.users);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            // this.authService.logout();
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
        this.userSearch();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          // this.authService.logout();
          this.alertify.dialogAlert('Error');
        }
      },
    });
  }

  resetPassword(userName: string) {
    this.alertify.confirmDialog(
      `Are You sure you want to reset user ${userName} password`,
      () => {
        this.dataService.resetPassword(userName).subscribe({
          next: (res) => {
            this.alertify.dialogAlert(res.title!);
            // console.log(res);
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              // this.authService.logout();
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
