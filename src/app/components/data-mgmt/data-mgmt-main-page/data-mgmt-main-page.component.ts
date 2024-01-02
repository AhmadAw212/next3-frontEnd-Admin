import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-data-mgmt-main-page',
  templateUrl: './data-mgmt-main-page.component.html',
  styleUrls: ['./data-mgmt-main-page.component.css'],
})
export class DataMgmtMainPageComponent {
  items!: MegaMenuItem[];
  dico: any;
  constructor(
    private userRolesService: UsersRolesService,
    private userIdlesService: UsersIdleService,
    private router: Router,
    private companyService: LoadingServiceService,
    private activatedRoute: ActivatedRoute,
    private dicoService: DicoServiceService
  ) {
    // this.userRolesService.getUserRoles();
  }
  async hasPerm(role: string): Promise<boolean> {
    try {
      const result = await this.userRolesService.hasPermission(role);
      return result;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false; // or handle the error appropriately
    }
  }
  async ngOnInit(): Promise<void> {
    await this.userRolesService.getUserRoles();
    await this.getDico();
    await this.getItems();
    this.companyService.clearSearchResults();
    // this.userIdlesService.initializeIdleService();
  }
  async getDico(): Promise<any> {
    await this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  async getItems() {
    this.items = [
      { label: 'Dashboard', routerLink: ['/profiles-main/DataManagement'] },
      {
        label: this.dico?.dico_reception || 'dico_reception',
        routerLink: ['/profiles-main/DataManagement/reception'],
        visible: await this.hasPerm('dmReception'),
      },
    ];
  }
}
