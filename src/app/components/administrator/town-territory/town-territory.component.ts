import { Component, OnInit } from '@angular/core';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { TownTerritory } from 'src/app/model/town-territory';
import { type } from 'src/app/model/type';
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
  code?: string = '';
  description?: string = '';
  townTerritory?: type[];
  showNearTerr?: boolean = false;

  selectedRegion?: type;
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
  }

  showNearTerritory(selectedRegion: type) {
    this.selectedRegion = selectedRegion;

    this.showNearTerr = true;
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
    this.isLoading = true;
    this.dataService
      .searchRegionTerritory(this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.townTerritory = res.data;
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
