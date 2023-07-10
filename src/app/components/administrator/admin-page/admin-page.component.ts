import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoreProfile } from 'src/app/model/core-profile';
import { Role } from 'src/app/model/role';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  userProfiles?: CoreProfile;
  userRoles?: Role;
  navBarTitle = 'Administrator';
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {}
}
