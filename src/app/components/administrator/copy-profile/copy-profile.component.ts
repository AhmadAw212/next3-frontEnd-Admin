import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CopyProfile } from 'src/app/model/copy-profile';
import { CoreUser } from 'src/app/model/core-user';
import { Profiles } from 'src/app/model/profiles';
import { AlertifyService } from 'src/app/services/alertify.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-copy-profile',
  templateUrl: './copy-profile.component.html',
  styleUrls: ['./copy-profile.component.css'],
})
export class CopyProfileComponent implements OnInit {
  users?: CoreUser[];
  selectedUserName?: string;
  selectedUserProfiles?: Profiles[];
  sourceUserName?: string;
  userProfiles?: Profiles[];
  constructor(
    private dialogRef: MatDialogRef<CopyProfileComponent>,
    private dataService: DataServiceService,
    private alertify: AlertifyService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getUsers();
    // console.log(this.data);
  }

  getUsers() {
    this.dataService.userSearch('', '').subscribe({
      next: (users) => {
        this.users = users.data;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          //this.authService.logout();
          this.alertify.dialogAlert('Error');
        }
      },
    });
  }

  getUserProfiles(userName: string) {
    this.dataService.getUserProfiles(userName).subscribe({
      next: (profiles) => {
        this.selectedUserProfiles = profiles.data;
        // console.log(profiles);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          //this.authService.logout();
          this.alertify.dialogAlert('Error');
        }
      },
    });
  }

  copyProfile() {
    const copyProfile: CopyProfile = {
      sourceUserId: this.selectedUserName,
      destinationUserId: this.data.selectedUser.userName,
      profiles: this.userProfiles,
    };

    this.dataService.copyProfiles(copyProfile).subscribe({
      next: (res) => {
        this.alertify.dialogAlert(res.title!);
        this.dialogRef.close();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          //this.authService.logout();
          this.alertify.dialogAlert('Error');
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
