import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Profiles } from 'src/app/model/profiles';
import { AlertifyService } from 'src/app/services/alertify.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

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
  dico?: any;
  ngOnInit(): void {
    this.getNonGrantedUserProfiles();
    this.getDico();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<AddProfileDialogComponent>,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {}
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
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
        console.log(err);
      },
    });
  }

  addProfile(userId: string, profId: string) {
    this.dataService.grantProfileToUser(userId, profId).subscribe({
      next: (res) => {
        this.selectedProfile = profId;
        this.alertifyService.success('Profile Added Successfully');
        this.dialogRef.close(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
