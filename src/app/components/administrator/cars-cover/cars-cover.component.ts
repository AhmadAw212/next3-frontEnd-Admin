import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarCover } from 'src/app/model/car-cover';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarCoverComponent } from '../add-dialogs/add-car-cover/add-car-cover.component';
import { UpdateCarCoverComponent } from '../update-dialogs/update-car-cover/update-car-cover.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-cars-cover',
  templateUrl: './cars-cover.component.html',
  styleUrls: ['./cars-cover.component.css'],
})
export class CarsCoverComponent implements OnInit {
  companies?: CompanyBranchList[];
  company?: string;
  carCover?: CarCover[];
  code: string = '';
  description: string = '';
  coverTypes?: type[];
  updatedCoverValues?: CarCover[] = [];
  reportDateTimeFormat?: string;
  selectedRow!: HTMLElement;
  dico?: any;
  isLoading: boolean = false;
  dateFormats?: any;
  selectedCover?: CarCover;
  showRiskCover?: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.getCoverTypes();
    // this.dateFormatterService();
    this.getDico();
    // this.userRolesService.getUserRoles();
  }
  trackCoverById(index: number, brand: CarCover) {
    return brand.id;
  }

  showCoverRisk(selectCover: CarCover) {
    this.selectedCover = selectCover;
    this.showRiskCover = true;
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }

  exportToExcel() {
    const data = this.carCover?.map((cover) => {
      return {
        ID: cover.id,
        Code: cover.code,
        Description: cover.description,
        Type: cover.coverTypeDescription,
        // Company: cover.insuranceDesc,
        'Created Date': this.datePipe.transform(
          cover.sysCreatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Created By': cover.sysCreatedBy,
        'Updated Date': this.datePipe.transform(
          cover.sysUpdatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': cover.sysUpdatedBy,
      };
    });

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Covers');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert the buffer to a Blob and save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Covers.xlsx');
  }
  dateFormatterService() {
    // this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        // console.log(this.companies);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCoverTypes() {
    this.dataService.getCoverTypes().subscribe({
      next: (res) => {
        this.coverTypes = res.data;
        // console.log(this.coverTypes?.map);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchCarCover() {
    this.dataService
      .searchCarCover(this.company!, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.carCover = res.data;
          console.log(res.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  deleteCarCover(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarCover(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarCover();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    );
  }

  openAddCoverDialog() {
    const dialogRef = this.dialog.open(AddCarCoverComponent, {
      data: {
        types: this.coverTypes,
        insuranceId: this.company,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarCover();
    });
  }

  // updateCarCoverDialog(carCover: CarCover) {
  //   const dialogRef = this.dialog.open(UpdateCarCoverComponent, {
  //     data: { carCover: carCover, type: this.coverTypes },
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.searchCarCover();
  //   });
  // }
  onTdBlur(
    event: FocusEvent,
    cover: CarCover,
    property: 'code' | 'description'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = cover[property];
    const newValue = tdElement.innerText.trim();
    const updatedCoverValues = this.updatedCoverValues ?? [];

    const index = updatedCoverValues.findIndex((item) => item.id === cover.id);
    if (index !== -1) {
      updatedCoverValues.splice(index, 1);
    }
    if (oldValue !== newValue) {
      cover[property] = newValue;
      this.updatedCoverValues?.push({
        id: cover.id,
        insuranceId: cover.insuranceId,
        code: cover.code,
        description: cover.description,
        type: cover.type,
      });
      // console.log(this.updatedCoverValues);
    }
  }

  onDropdownChange(event: Event, cover: CarCover, property: 'type') {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedCarInfoVal = this.updatedCoverValues ?? [];
    const index = updatedCarInfoVal.findIndex((item) => item.id === cover.id);
    if (index !== -1) {
      updatedCarInfoVal.splice(index, 1);
    }
    this.updatedCoverValues?.push({
      id: cover.id,
      insuranceId: cover.insuranceId,
      code: cover.code,
      description: cover.description,
      type: cover.type,
    });
    // console.log(this.updatedCoverValues);
  }

  updateCarInfo() {
    if (this.updatedCoverValues?.length) {
      this.dataService.updateCarCover(this.updatedCoverValues).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message!);
          this.updatedCoverValues = [];
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
