import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/model/api-response';
import { CoreUser } from 'src/app/model/core-user';
import { Profiles } from 'src/app/model/profiles';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { DataServiceService } from 'src/app/shared/data-service.service';
import { AddProfileDialogComponent } from '../add-profile-dialog/add-profile-dialog.component';
import { CopyProfileComponent } from '../copy-profile/copy-profile.component';

@Component({
  selector: 'app-user-profiles',
  templateUrl: './user-profiles.component.html',
  styleUrls: ['./user-profiles.component.css'],
})
export class UserProfilesComponent implements OnChanges {
  profiles?: Profiles[];
  showRoleList = false;
  @Input() selectedUser?: CoreUser;
  selectedProfile?: Profiles;

  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertify: AlertifyService
  ) {}

  ngOnChanges() {
    this.getProfiles();
  }

  RoleList(selectedProfile: Profiles) {
    this.selectedProfile = selectedProfile;
    this.showRoleList = true;
  }

  getProfiles() {
    const userName = this.selectedUser?.userName!;
    this.dataService.getUserProfiles(userName).subscribe({
      next: (res: ApiResponse) => {
        this.profiles = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openProfileDialog(): void {
    const dialogRef = this.dialog.open(AddProfileDialogComponent, {
      data: {
        profiles: this.profiles,
        selectedUser: this.selectedUser,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profiles = result;
      }
    });
  }

  deleteProfile(profId: string) {
    const userName = this.selectedUser?.userName!;

    this.alertify.confirmDialog(
      'Are you sure you want to remove profile',
      () => {
        this.dataService.deleteProfile(userName, profId).subscribe({
          next: (res) => {
            this.alertify.dialogAlert(res.message!);
            this.profiles = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    );
  }

  CopyProfileDialog() {
    this.dialog.open(CopyProfileComponent, { data: this.profiles });
  }
}
