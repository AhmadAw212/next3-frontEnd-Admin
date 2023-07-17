import { Component, OnInit } from '@angular/core';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { TownTerritory } from 'src/app/model/town-territory';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
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
  dico?: any;
  dateFormats?: any;
  selectedRegion?: type;
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {}

  ngOnInit(): void {
    // this.getCompaniesPerUser();
    this.getDico();
    this.userRolesService.getUserRoles();
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  exportToExcel() {
    const data = this.townTerritory?.map((data) => {
      return {
        Code: data.code,
        Description: data.description,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Territories');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Territories.xlsx');
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
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
          // this.authService.logout();
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
            // this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
