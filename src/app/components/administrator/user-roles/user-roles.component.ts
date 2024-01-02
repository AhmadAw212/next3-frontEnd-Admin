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
import { AlertifyService } from 'src/app/services/alertify.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css'],
})
export class UserRolesComponent implements OnInit, OnChanges {
  @Input() profiles?: Profiles[];
  @Input() selectedProfile?: Profiles;
  @Input() selectedUser?: CoreUser;
  roles?: Role[] = [];
  roleCodeFilter: string = '';
  roleDescFilter: string = '';
  rolesPage: number = 1;
  maxSizeValue = 10;
  dico?: any;
  loading: boolean = false;
  constructor(
    private dataService: DataServiceService,
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
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  ngOnChanges() {
    const selectedProfile = this.selectedProfile!;
    this.getUserRoles(selectedProfile);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getUserRoles(profileId: Profiles) {
    const selected_profile = this.profiles?.find((p) => p.id === profileId.id);
    this.roles = selected_profile?.profileRoles;
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
    // console.log(profileId);

    this.dataService.updateRoles(userId, profileId).subscribe({
      next: (roles) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Roles Updated Successfully',
          detail: roles.title,
        });
        // console.log(roles.data);
      },
      error: (err) => {
        let errorMessage = 'An error occurred';
        if (err.status === 401) {
          errorMessage = 'Incorrect username or password';
        } else if (err.status === 500) {
          errorMessage = 'An error occurred. Please try again later.';
        }

        this.alertify.error(errorMessage);
      },
    });
  }

  getProfileDefaultAccessRoles() {
    const profile = this.selectedProfile?.code!;
    const userName = this.selectedUser?.userName!;
    const companyId = this.selectedUser?.companyId!;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
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
      },
    });
  }
}
