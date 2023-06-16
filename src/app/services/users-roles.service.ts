import { Injectable } from '@angular/core';
import { Role } from '../model/role';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root',
})
export class UsersRolesService {
  userRoles?: Role[];
  roleNames?: string[] = [];

  constructor(private dataService: DataServiceService) {}
  hasPermission(roleName: string): boolean {
    const trimmedRoleName = roleName.trim();
    const index = this.roleNames?.indexOf(trimmedRoleName);
    return index !== -1; // Return true if index is not -1 (roleName found), false otherwise
  }
  getUserRoles() {
    const selectedProfile = localStorage.getItem('selectedProfile');

    this.dataService.getUserRoles(selectedProfile!).subscribe({
      next: (res) => {
        this.userRoles = res.data;
        this.roleNames = this.userRoles?.map((role) => role.id!) ?? [];
        console.log('User roles:', this.userRoles);
        console.log('Role names:', this.roleNames);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
