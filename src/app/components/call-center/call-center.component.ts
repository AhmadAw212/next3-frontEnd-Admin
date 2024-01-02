import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-call-center',
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.css'],
})
export class CallCenterComponent implements OnInit {
  title = 'Call Center Main';
  screenWidth?: number;
  items!: MegaMenuItem[];
  showBackButton: boolean = false;
  dico: any;
  constructor(
    private userRolesService: UsersRolesService,
    private userIdlesService: UsersIdleService,
    private router: Router,
    private companyService: LoadingServiceService,
    private activatedRoute: ActivatedRoute,
    private dicoService: DicoServiceService
  ) {}
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
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showBackButton = this.activatedRoute.firstChild !== null;
      });

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
      { label: 'Dashboard', routerLink: ['/profiles-main/CallCenter'] },
      {
        label:
          this.dico?.dico_search_notification || 'dico_search_notification',
        routerLink: ['/profiles-main/CallCenter/searchNotification'],
        visible: await this.hasPerm('ccSearchNotification '),
      },
      {
        label: this.dico?.dico_towing_condition || 'dico_towing_condition',
        routerLink: ['/profiles-main/CallCenter/towingCondition'],
        visible: await this.hasPerm('ccSearchNotification '),
      },
      {
        label: this.dico?.dico_user_activity || 'dico_user_activity',
        routerLink: ['/profiles-main/CallCenter/usersActivity'],
        visible: await this.hasPerm('ccUserActivity '),
      },
      {
        label: this.dico?.dico_search_policy || 'dico_search_policy',
        routerLink: ['/profiles-main/CallCenter/searchPolicy'],
        visible: await this.hasPerm('ccSearchPolicy '),
      },
      {
        label: this.dico?.dico_phone_index || 'dico_phone_index',
        routerLink: ['/profiles-main/CallCenter/phoneIndex'],
        visible: await this.hasPerm('ccPhoneIndex '),
      },
    ];
  }
}
