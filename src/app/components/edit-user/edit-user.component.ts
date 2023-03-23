import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreUser } from 'src/app/model/core-user';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { CompanyBranchService } from 'src/app/shared/company-branch.service';
import { DataServiceService } from 'src/app/shared/data-service.service';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
  users?: CoreUser[] = [];
  selectedUser?: CoreUser;
  showProfileList = false;

  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertify: AlertifyService,
    public companyBranchService: CompanyBranchService
  ) {
    this.subscribedUsers();
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
        console.log(this.users);
      },
      error: (err) => {
        console.log(err);
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
        console.log(err);
      },
    });
  }
}
