import { Component, OnInit } from '@angular/core';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { TownTerritory } from 'src/app/model/town-territory';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-town-territory',
  templateUrl: './town-territory.component.html',
  styleUrls: ['./town-territory.component.css'],
})
export class TownTerritoryComponent implements OnInit {
  company?: string;
  companies?: CompanyBranchList[];
  isLoading?: boolean = false;
  selectedRow!: HTMLElement;
  territoryName?: string = '';
  townName?: string = '';
  townTerritory?: TownTerritory[];
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.closest('tr') as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        // console.log(this.companies);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  searchTownTerritory() {
    this.dataService
      .searchCarsTownTerritory(
        this.company!,
        this.territoryName!,
        this.townName!
      )
      .subscribe({
        next: (res) => {
          this.townTerritory = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
