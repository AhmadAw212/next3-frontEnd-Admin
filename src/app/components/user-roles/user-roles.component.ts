import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
  p: number = 1;
  maxSizeValue = 5;

  constructor(
    private dataService: DataServiceService,
    private alertify: AlertifyService
  ) {}
  ngOnChanges() {
    this.getUserRoles(this.selectedProfile!);
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

  updateRoles() {
    const userId = this.selectedUser?.userName;
    const profileId = this.selectedProfile;
    this.dataService.updateRoles(userId!, profileId!).subscribe({
      next: (roles) => {
        console.log(roles);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
