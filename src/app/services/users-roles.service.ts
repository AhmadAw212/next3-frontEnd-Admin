import { Injectable } from '@angular/core';
import { Role } from '../model/role';
import { DataServiceService } from './data-service.service';
import { AuthService } from './auth.service';
import { AlertifyService } from './alertify.service';
import { LoadingServiceService } from './loading-service.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersRolesService {
  userRoles: Role[] = [];
  roleNames: any[] = [];

  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService
  ) {}

  hasPermission(roleName: string): boolean {
    const trimmedRoleName = roleName.trim();
    const index = this.roleNames.indexOf(trimmedRoleName);
    return index !== -1;
  }
  async getUserRoles(): Promise<void> {
    const profile = this.profileService.getSelectedProfile();
    const profileId = profile?.id;

    if (profileId) {
      try {
        const res = await lastValueFrom(
          this.dataService.getUserRoles(profileId)
        );

        this.userRoles = res.data;
        this.roleNames = this.userRoles.map((role) => role.id);
        // console.log('User roles:', this.userRoles);
        // console.log('Role names:', this.roleNames);
      } catch (err) {
        // Handle the error appropriately
        // this.alertifyService.error(err.error.message);
        console.error(err);
      }
    } else {
      // You might want to throw an error or handle this case appropriately
      // return Promise.reject(new Error('Profile ID not available'));
      return Promise.resolve();
    }
  }
  getUserRolesData(): any[] {
    return this.userRoles;
  }
  clearRoles(): void {
    this.userRoles = [];
    this.roleNames = [];
  }
}
