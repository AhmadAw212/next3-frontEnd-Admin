import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoreProfile } from 'src/app/model/core-profile';
import { Role } from 'src/app/model/role';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

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
  constructor(
    private dataService: DataServiceService,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.getDico();
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
