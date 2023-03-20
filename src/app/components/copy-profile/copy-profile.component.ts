import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CoreUser } from 'src/app/model/core-user';
import { Profiles } from 'src/app/model/profiles';
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
  constructor(
    private dialogRef: MatDialogRef<CopyProfileComponent>,
    private dataService: DataServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.dataService.userSearch('', '').subscribe({
      next: (users) => {
        this.users = users.data;
      },
    });
  }

  getUserProfiles(userId: string) {
    this.dataService.getUserProfiles(userId).subscribe({
      next: (profiles) => {
        this.selectedUserProfiles = profiles.data;
        console.log(profiles);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
