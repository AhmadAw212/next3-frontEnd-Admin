import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CopyProfile } from 'src/app/model/copy-profile';
import { CoreUser } from 'src/app/model/core-user';
import { Profiles } from 'src/app/model/profiles';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { DataServiceService } from 'src/app/shared/data-service.service';

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
    });
  }

  getUserProfiles(userName: string) {
    this.dataService.getUserProfiles(userName).subscribe({
      next: (profiles) => {
        this.selectedUserProfiles = profiles.data;
        // console.log(profiles);
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
        console.log(err);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
