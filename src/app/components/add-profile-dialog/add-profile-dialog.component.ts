import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Profiles } from 'src/app/model/profiles';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/shared/data-service.service';

@Component({
  selector: 'app-add-profile-dialog',
  templateUrl: './add-profile-dialog.component.html',
  styleUrls: ['./add-profile-dialog.component.css'],
})
export class AddProfileDialogComponent implements OnInit {
  profiles?: Profiles[];
  selectedUserId?: string;
  nonGrantedProfile?: Profiles[];
  selectedProfile?: string;

  ngOnInit(): void {
    this.getNonGrantedUserProfiles();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<AddProfileDialogComponent>,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  getNonGrantedUserProfiles() {
    this.selectedUserId = this.data.selectedUser.userName;
    this.dataService.getNonGrantedUserProfiles(this.selectedUserId!).subscribe({
      next: (profiles) => {
        this.nonGrantedProfile = profiles.data;
        if (this.nonGrantedProfile!.length > 0) {
          this.selectedProfile = this.nonGrantedProfile![0].code;
        }
      },
      error: (err) => {
        if (err.error === 'Token Expired') {
          this.authService.logout();
          console.log(err.error);
        }
      },
    });
  }

  addProfile(userId: string, profId: string) {
    this.dataService.grantProfileToUser(userId, profId).subscribe({
      next: (res) => {
        this.selectedProfile = profId;
        this.alertify.dialogAlert('Profile Added Successfully');
        this.dialogRef.close(res.data);
      },
      error: (err) => {
        if (err.error === 'Token Expired') {
          this.authService.logout();
          console.log(err.error);
        }
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
