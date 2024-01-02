import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-survey-main-page',
  templateUrl: './survey-main-page.component.html',
  styleUrls: ['./survey-main-page.component.css'],
})
export class SurveyMainPageComponent {
  screenWidth?: number;
  items!: MegaMenuItem[];
  dico: any;
  constructor(
    private userRolesService: UsersRolesService,
    private dicoService: DicoServiceService,
    private companyService: LoadingServiceService
  ) {
    // this.userRolesService.getUserRoles();
    // this.companyService.clearSearchResults();
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
      { label: 'Dashboard', routerLink: ['/profiles-main/Survey'] },
      {
        label: this.dico?.dico_survey || 'dico_survey',
        routerLink: ['/profiles-main/Survey/surveyRequest'],
      },
    ];
  }
}
