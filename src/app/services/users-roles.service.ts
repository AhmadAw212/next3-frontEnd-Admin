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
    const index = this.roleNames?.indexOf(roleName);
    return index === -1;
  }

  getUserRoles() {
    const selectedProfile = localStorage.getItem('selectedProfile');

    this.dataService.getUserRoles(selectedProfile!).subscribe({
      next: (res) => {
        this.userRoles = res.data;
        this.roleNames = [];
        this.userRoles?.forEach((res) => {
          this.roleNames?.push(res.id!);
        });
        // console.log(this.roleNames);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
