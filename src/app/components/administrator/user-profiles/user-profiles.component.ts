import { DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/model/api-response';
import { CoreUser } from 'src/app/model/core-user';
import { Profiles } from 'src/app/model/profiles';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddProfileDialogComponent } from '../add-dialogs/add-profile-dialog/add-profile-dialog.component';
import { CopyProfileComponent } from '../copy-profile/copy-profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { MessageService, ConfirmationService } from 'primeng/api';
// import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-user-profiles',
  templateUrl: './user-profiles.component.html',
  styleUrls: ['./user-profiles.component.css'],
})
export class UserProfilesComponent implements OnInit, OnChanges {
  profiles?: Profiles[];
  showRoleList = false;
  @Input() selectedUser?: CoreUser;
  selectedProfile?: Profiles;
  loading: boolean = false;
  dico?: any;
  addProfileDialog: boolean = false;
  nonGrantedProfile?: Profiles[];
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertify: AlertifyService,
    private authService: AuthService,
    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.getDico();

    // this.userRolesService.getUserRoles();
  }

  openNew() {
    // this.product = {};
    // this.submitted = false;
    this.addProfileDialog = true;
    this.getNonGrantedUserProfiles();
  }
  hideDialog() {
    this.addProfileDialog = false;
    // this.submitted = false;
  }
  addProfile(userId: string, profId: string) {
    this.dataService.grantProfileToUser(userId, profId).subscribe({
      next: (res) => {
        // this.selectedProfile = profId;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Profile Added Successfully',
          life: 3000,
        });
        this.addProfileDialog = false;
        this.getProfiles();
        // this.alertifyService.success('Profile Added Successfully');
        // this.dialogRef.close(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // onCancel(): void {
  //   this.dialogRef.close();
  // }
  ngOnChanges() {
    this.getProfiles();
    this.showRoleList = false;
  }
  getNonGrantedUserProfiles() {
    const userName = this.selectedUser?.userName;
    this.dataService.getNonGrantedUserProfiles(userName!).subscribe({
      next: (profiles) => {
        this.nonGrantedProfile = profiles.data;
        // if (this.nonGrantedProfile!.length > 0) {
        //   this.selectedProfile = this.nonGrantedProfile![0]?.code;
        // }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  RoleList(selectedProfile: Profiles) {
    this.selectedProfile = selectedProfile;
    this.showRoleList = true;
  }

  getProfiles() {
    this.loading = true;
    const userName = this.selectedUser?.userName!;
    this.dataService.getUserProfiles(userName).subscribe({
      next: (res: ApiResponse) => {
        this.profiles = res.data;
      },
      error: (err) => {
        // this.authService.logout();
        console.log(err.error);
      },
      complete: () => {
        this.loading = false;
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
            this.alertify.success(res.message!);
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
    const dialogRef = this.dialog.open(CopyProfileComponent, {
      data: { profiles: this.profiles, selectedUser: this.selectedUser },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProfiles();
    });
  }
}
