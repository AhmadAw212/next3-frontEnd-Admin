import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-data-mgmt-main-page',
  templateUrl: './data-mgmt-main-page.component.html',
  styleUrls: ['./data-mgmt-main-page.component.css']
})
export class DataMgmtMainPageComponent {
  constructor(
    private userRolesService: UsersRolesService,
    private userIdlesService: UsersIdleService,
    private router: Router,
    private companyService: LoadingServiceService,
    private activatedRoute: ActivatedRoute
  ) {    this.userRolesService.getUserRoles();
    this.companyService.clearSearchResults();}

  
}
