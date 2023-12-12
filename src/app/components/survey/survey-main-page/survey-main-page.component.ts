import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-survey-main-page',
  templateUrl: './survey-main-page.component.html',
  styleUrls: ['./survey-main-page.component.css'],
})
export class SurveyMainPageComponent {
  constructor(
    private userRolesService: UsersRolesService,

    private companyService: LoadingServiceService
  ) {
    this.userRolesService.getUserRoles();
    this.companyService.clearSearchResults();
  }
}
