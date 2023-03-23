import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { CoreUser } from 'src/app/model/core-user';
import { Profiles } from 'src/app/model/profiles';
import { Role } from 'src/app/model/role';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { DataServiceService } from 'src/app/shared/data-service.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css'],
})
export class UserRolesComponent implements OnChanges {
  @Input() profiles?: Profiles[];
  @Input() selectedProfile?: Profiles;
  @Input() selectedUser?: CoreUser;
  roles?: Role[];
  roleCodeFilter: string = '';
  roleDescFilter: string = '';
  rolesPage: number = 1;
  maxSizeValue = 5;

  constructor(
    private dataService: DataServiceService,
    private alertify: AlertifyService
  ) {}

  ngOnChanges() {
    const selectedProfile = this.selectedProfile!;
    this.getUserRoles(selectedProfile);
  }

  getUserRoles(profileId: Profiles) {
    const role = this.profiles?.find((role) => role.id === profileId.id);
    this.roles = role?.profileRoles;
  }

  get filteredRoles() {
    return this.roles?.filter(
      (role: Role) =>
        role.id?.toLowerCase().includes(this.roleCodeFilter.toLowerCase()) &&
        role
          .description!.toLowerCase()
          .includes(this.roleDescFilter.toLowerCase())
    );
  }

  // oncheckboxchange(role: Role) {
  //   const roles = (role.granted = role.granted);
  //   console.log(roles);
  // }

  updateRoles() {
    const userId = this.selectedUser?.userName!;
    const profileId = this.selectedProfile!;
    this.dataService.updateRoles(userId, profileId).subscribe({
      next: (roles) => {
        this.alertify.dialogAlert(roles.message!);

        console.log(roles.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProfileDefaultAccessRoles() {
    const profile = this.selectedProfile?.code!;
    const userName = this.selectedUser?.userName!;
    const companyId = this.selectedUser?.companyId!;

    this.alertify.confirmDialog(
      'Are you sure you want to override the existing roles ?',
      () => {
        this.dataService
          .getProfileDefaultAccessRoles(userName, companyId, profile)
          .subscribe({
            next: (defaultRoles) => {
              const fullRoles = this.roles?.map((role) => {
                const matchingRoles = defaultRoles.find(
                  (defaultRole) => defaultRole.id === role.id
                );

                if (matchingRoles) {
                  role.granted = true;
                } else {
                  role.granted = false;
                }
                return role;
              });

              this.roles = fullRoles;
              this.updateRoles();
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    );
  }
}
