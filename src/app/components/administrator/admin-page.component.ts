import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { Subscription, filter } from 'rxjs';
import { CoreProfile } from 'src/app/model/core-profile';
import { Role } from 'src/app/model/role';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  userProfiles?: CoreProfile;
  userRoles?: Role;
  navBarTitle = 'Administrator';
  dico?: any;
  showBackButton: boolean = false;
  items!: MenuItem[];
  home!: MenuItem;
  breadcrumbItems: MenuItem[] = [];
  sidebarVisible: boolean = false;
  displaySidebar: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService,
    private userIdlesService: UsersIdleService,
    private router: Router
  ) {}

  // hasPerm(role: string): boolean {
  //   return this.userRolesService.hasPermission(role);
  // }
  async getDico(): Promise<any> {
    await this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  async ngOnInit(): Promise<void> {
    this.updateBreadcrumb();
    await this.userRolesService.getUserRoles();
    await this.getDico();
    await this.getItems();
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
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  updateBreadcrumb() {
    const currentUrl = this.router.url; // Assuming you have router injected
    const urlParts = currentUrl.split('/');
    // Assuming URL structure: /profiles-main/{parent}/{child}/{label}
    if (urlParts.length >= 3) {
      const parentLabel = urlParts[2]; // Adjust indices based on your URL structure
      const childLabel = urlParts.length > 3 ? urlParts[3] : null;
      const label = urlParts.length > 4 ? urlParts[4] : null;

      this.breadcrumbItems = [{ label: parentLabel }];

      if (childLabel) {
        this.breadcrumbItems.push({ label: childLabel });
      }

      if (label) {
        this.breadcrumbItems.push({ label: label });
      }
    }
  }
  async getItems() {
    this.items = [
      // { label: '', icon: 'pi pi-home' },
      {
        label: this.dico?.dico_user_management || 'dico_user_management',

        items: [
          {
            label: this.dico?.dico_add_user || 'dico_add_user',
            url: '/profiles-main/Administrator/userManagement/addUser',
            command: () => {
              this.updateBreadcrumb();
            },
            routerLink: ['/profiles-main/Administrator/userManagement/addUser'],
          },
          {
            label: this.dico?.dico_edit_user || 'dico_edit_user',
            command: () => {
              this.updateBreadcrumb();
            },
            routerLink: [
              '/profiles-main/Administrator/userManagement/editUser',
            ],
          },
          {
            label: this.dico?.dico_approval || 'dico_approval',
            command: () => {
              this.updateBreadcrumb();
            },
            routerLink: [
              '/profiles-main/Administrator/userManagement/approval',
            ],
          },
        ],
        visible: await this.hasPerm('admUserManagment'),
      },

      {
        label:
          this.dico?.dico_system_configuration || 'dico_system_configuration',

        items: [
          {
            label: this.dico?.DRAWER_CONFIGURATION || 'DRAWER_CONFIGURATION',
            routerLink: [
              '/profiles-main/Administrator/systemConfiguration/coreConfig',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCoreConfiguration'),
          },
          {
            label: this.dico?.dico_language || 'dico_language',
            routerLink: [
              '/profiles-main/Administrator/systemConfiguration/languageConfig',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCoreResourceBundle'),
          },
          {
            label: this.dico?.dico_document || 'dico_document',
            routerLink: [
              '/profiles-main/Administrator/systemConfiguration/coreDocument',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCoreDocumentFile'),
          },
          {
            label: this.dico?.dico_domain || 'dico_domain',
            routerLink: [
              '/profiles-main/Administrator/systemConfiguration/coreDomain',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCoreDomainValue'),
          },
        ],
        visible:
          (await this.hasPerm('admCoreConfiguration')) ||
          (await this.hasPerm('admCoreResourceBundle')) ||
          (await this.hasPerm('admCoreDocumentFile')) ||
          (await this.hasPerm('admCoreDomainValue')),
      },
      {
        label: this.dico?.dico_tables || 'dico_tables',

        items: [
          {
            label: this.dico?.dico_car_brand || 'dico_car_brand',
            routerLink: ['/profiles-main/Administrator/tables/carsBrand'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsBrand'),
          },
          {
            label: this.dico?.dico_cover || 'dico_cover',
            routerLink: ['/profiles-main/Administrator/tables/carCovers'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsCovers'),
          },
          {
            label: this.dico?.dico_cars_clients || 'dico_cars_clients',
            routerLink: ['/profiles-main/Administrator/tables/carsClient'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsClient'),
          },
          {
            label: this.dico?.dico_product || 'dico_product',
            routerLink: ['/profiles-main/Administrator/tables/carSublines'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsSublines'),
          },
          {
            label: this.dico?.dico_subline_desc || 'dico_subline_desc',
            routerLink: ['/profiles-main/Administrator/tables/carProducts'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsProducts'),
          },
          {
            label: this.dico?.dico_report_list || 'dico_report_list',
            routerLink: ['/profiles-main/Administrator/tables/carReportList'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admReportList'),
          },
          {
            label: this.dico?.dico_supplier || 'dico_supplier',
            routerLink: ['/profiles-main/Administrator/tables/carSupplier'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsSupplier'),
          },
          {
            label: this.dico?.dico_expert_config || 'dico_expert_config',
            routerLink: ['/profiles-main/Administrator/tables/expertConfig'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsExpertConfig'),
          },
          {
            label:
              this.dico?.dico_expert_default_fees || 'dico_expert_default_fees',
            routerLink: [
              '/profiles-main/Administrator/tables/carsExpertDefaultFees',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsExpertDefaultFeesConfig'),
          },
          {
            label: this.dico?.dico_branch || 'dico_branch',
            routerLink: ['/profiles-main/Administrator/tables/branchConfig'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsBranch'),
          },
          {
            label: this.dico?.dico_broker || 'dico_broker',
            routerLink: ['/profiles-main/Administrator/tables/carBroker'],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsBroker'),
          },
          {
            label: this.dico?.dico_territory || 'dico_territory',
            routerLink: [
              '/profiles-main/Administrator/tables/carTerritoryTown',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsTerritoryTown'),
          },
          {
            label:
              this.dico?.dico_cars_case_mngr_setup ||
              'dico_cars_case_mngr_setup',
            routerLink: [
              '/profiles-main/Administrator/tables/carsCaseMngrSetup',
            ],
            command: () => {
              this.updateBreadcrumb();
            },
            visible: await this.hasPerm('admCarsCaseMngrSetup'),
          },
        ],
        visible:
          (await this.hasPerm('admCarsCovers')) ||
          (await this.hasPerm('admCarsClient')) ||
          (await this.hasPerm('admCarsProducts')) ||
          (await this.hasPerm('admCarsSublines')) ||
          (await this.hasPerm('admReportList')) ||
          (await this.hasPerm('admCarsSupplier')) ||
          (await this.hasPerm('admCarsExpertConfig')) ||
          (await this.hasPerm('admCarsBranch')) ||
          (await this.hasPerm('admCarsBroker')) ||
          (await this.hasPerm('admCarsTerritoryTown')) ||
          (await this.hasPerm('admCarsExpertDefaultFeesConfig')) ||
          (await this.hasPerm('admCarsBrand')),
      },

      // Add other top-level menu items as needed
    ];
  }
}
