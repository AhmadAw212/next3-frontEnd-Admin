import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoreProfile } from 'src/app/model/core-profile';
import { DataServiceService } from 'src/app/shared/data-service.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  userProfiles?: CoreProfile;
  constructor(
    private router: Router,
    private dataService: DataServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUserRoles();
  }

  getUserRoles() {
    const selectedProfile = localStorage.getItem('selectedProfile');
    this.dataService
      .getUserRoles(selectedProfile!)
      .subscribe((data) => console.log(data));
  }
}
