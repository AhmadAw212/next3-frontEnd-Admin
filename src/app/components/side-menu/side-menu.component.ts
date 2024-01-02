import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'primeng/api';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {
  @Input() showSurveyReq: boolean = false;
  selectedCity?: any;
  @Input() items!: MenuItem[];
  searchIcon = faSearch;
  screenWidth?: number;
  profileId!: string;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @Input() dico?: any;
  isLoading: boolean = false;
  @Input() callCenter: boolean = false;
  displaySidebar = false;
  isOpened: boolean = false;
  sidebarVisible: boolean = true;
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private userRolesService: UsersRolesService,
    private dicoService: DicoServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  toggleMenu() {
    this.sidenav.toggle();
  }
  async ngOnInit(): Promise<void> {
    // await this.userRolesService.getUserRoles();
    // await this.getDico();
    // await this.getItems();
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
  async getDico(): Promise<any> {
    await this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  toggleSidebar() {
    // console.log('hello');
    this.displaySidebar = !this.displaySidebar;
  }

  async getItems() {
    return (this.items = [
      // {
      //   label: this.dico?.dico_user_management || 'dico_user_management',
      //   items: [
      //     {
      //       label: 'Dashboard',
      //       routerLink: ['/profiles-main/Administrator'],
      //     },
      //     {
      //       label: this.dico?.dico_add_user || 'dico_add_user',
      //       routerLink: ['/profiles-main/Administrator/addUser'],
      //     },
      //     {
      //       label: this.dico?.dico_edit_user || 'dico_edit_user',
      //       routerLink: ['/profiles-main/Administrator/editUser'],
      //     },
      //   ],
      //   visible: await this.hasPerm('admUserManagment'),
      // },
      // {
      //   label:
      //     this.dico?.dico_system_configuration || 'dico_system_configuration',
      //   items: [
      //     {
      //       label: this.dico?.DRAWER_CONFIGURATION || 'DRAWER_CONFIGURATION',
      //       routerLink: ['/profiles-main/Administrator/coreConfig'],
      //       visible: await this.hasPerm('admCoreConfiguration'),
      //     },
      //     {
      //       label: this.dico?.dico_language || 'dico_language',
      //       routerLink: ['/profiles-main/Administrator/languageConfig'],
      //       visible: await this.hasPerm('admCoreResourceBundle'),
      //     },
      //     {
      //       label: this.dico?.dico_document || 'dico_document',
      //       routerLink: ['/profiles-main/Administrator/coreDocument'],
      //       visible: await this.hasPerm('admCoreDocumentFile'),
      //     },
      //     {
      //       label: this.dico?.dico_domain || 'dico_domain',
      //       routerLink: ['/profiles-main/Administrator/coreDomain'],
      //       visible: await this.hasPerm('admCoreDomainValue'),
      //     },
      //   ],
      //   visible:
      //     (await this.hasPerm('admCoreConfiguration')) ||
      //     (await this.hasPerm('admCoreResourceBundle')) ||
      //     (await this.hasPerm('admCoreDocumentFile')) ||
      //     (await this.hasPerm('admCoreDomainValue')),
      // },
      // {
      //   label: this.dico?.dico_tables || 'dico_tables',
      //   items: [
      //     {
      //       label: this.dico?.dico_car_brand || 'dico_car_brand',
      //       routerLink: ['/profiles-main/Administrator/carsBrand'],
      //       visible: await this.hasPerm('admCarsBrand'),
      //     },
      //     {
      //       label: this.dico?.dico_cover || 'dico_cover',
      //       routerLink: ['/profiles-main/Administrator/carCovers'],
      //       visible: await this.hasPerm('admCarsCovers'),
      //     },
      //     {
      //       label: this.dico?.dico_cars_clients || 'dico_cars_clients',
      //       routerLink: ['/profiles-main/Administrator/carsClient'],
      //       visible: await this.hasPerm('admCarsClient'),
      //     },
      //     {
      //       label: this.dico?.dico_product || 'dico_product',
      //       routerLink: ['/profiles-main/Administrator/carSublines'],
      //       visible: await this.hasPerm('admCarsSublines'),
      //     },
      //     {
      //       label: this.dico?.dico_subline_desc || 'dico_subline_desc',
      //       routerLink: ['/profiles-main/Administrator/carProducts'],
      //       visible: await this.hasPerm('admCarsProducts'),
      //     },
      //     {
      //       label: this.dico?.dico_report_list || 'dico_report_list',
      //       routerLink: ['/profiles-main/Administrator/carReportList'],
      //       visible: await this.hasPerm('admReportList'),
      //     },
      //     {
      //       label: this.dico?.dico_supplier || 'dico_supplier',
      //       routerLink: ['/profiles-main/Administrator/carSupplier'],
      //       visible: await this.hasPerm('admCarsSupplier'),
      //     },
      //     {
      //       label: this.dico?.dico_expert_config || 'dico_expert_config',
      //       routerLink: ['/profiles-main/Administrator/expertConfig'],
      //       visible: await this.hasPerm('admCarsExpertConfig'),
      //     },
      //     {
      //       label:
      //         this.dico?.dico_expert_default_fees || 'dico_expert_default_fees',
      //       routerLink: ['/profiles-main/Administrator/carsExpertDefaultFees'],
      //       visible: await this.hasPerm('admCarsExpertDefaultFeesConfig'),
      //     },
      //     {
      //       label: this.dico?.dico_branch || 'dico_branch',
      //       routerLink: ['/profiles-main/Administrator/branchConfig'],
      //       visible: await this.hasPerm('admCarsBranch'),
      //     },
      //     {
      //       label: this.dico?.dico_broker || 'dico_broker',
      //       routerLink: ['/profiles-main/Administrator/carBroker'],
      //       visible: await this.hasPerm('admCarsBroker'),
      //     },
      //     {
      //       label: this.dico?.dico_territory || 'dico_territory',
      //       routerLink: ['/profiles-main/Administrator/carTerritoryTown'],
      //       visible: await this.hasPerm('admCarsTerritoryTown'),
      //     },
      //     {
      //       label:
      //         this.dico?.dico_cars_case_mngr_setup ||
      //         'dico_cars_case_mngr_setup',
      //       routerLink: ['/profiles-main/Administrator/carsCaseMngrSetup'],
      //       visible: await this.hasPerm('admCarsCaseMngrSetup'),
      //     },
      //   ],
      //   visible:
      //     (await this.hasPerm('admCarsCovers')) ||
      //     (await this.hasPerm('admCarsClient')) ||
      //     (await this.hasPerm('admCarsProducts')) ||
      //     (await this.hasPerm('admCarsSublines')) ||
      //     (await this.hasPerm('admReportList')) ||
      //     (await this.hasPerm('admCarsSupplier')) ||
      //     (await this.hasPerm('admCarsExpertConfig')) ||
      //     (await this.hasPerm('admCarsBranch')) ||
      //     (await this.hasPerm('admCarsBroker')) ||
      //     (await this.hasPerm('admCarsTerritoryTown')) ||
      //     (await this.hasPerm('admCarsExpertDefaultFeesConfig')) ||
      //     (await this.hasPerm('admCarsBrand')),
      // },
      // Add other top-level menu items as needed
    ]);
  }
}
