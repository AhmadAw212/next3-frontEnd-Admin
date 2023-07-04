import { Injectable } from '@angular/core';
import { Role } from '../model/role';
import { DataServiceService } from './data-service.service';
import { AuthService } from './auth.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root',
})
export class UsersRolesService {
  userRoles: Role[] = [];
  roleNames: any[] = [];

  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  hasPermission(roleName: string): boolean {
    const trimmedRoleName = roleName.trim();
    const index = this.roleNames.indexOf(trimmedRoleName);
    return index !== -1;
  }

  getUserRoles(): void {
    const selectedProfile = localStorage.getItem('selectedProfile');
    if (selectedProfile) {
      this.dataService.getUserRoles(selectedProfile).subscribe({
        next: (res) => {
          this.userRoles = res.data;
          this.roleNames = this.userRoles.map((role) => role.id);
          // console.log('User roles:', this.userRoles);
          // console.log('Role names:', this.roleNames);
        },
        error: (err) => {
          // this.alertifyService.error(err.error.message);
          console.log(err);
        },
      });
    }
  }
}
