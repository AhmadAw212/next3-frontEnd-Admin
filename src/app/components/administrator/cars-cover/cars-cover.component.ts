import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarCover } from 'src/app/model/car-cover';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarCoverComponent } from '../add-dialogs/add-car-cover/add-car-cover.component';
import { UpdateCarCoverComponent } from '../update-dialogs/update-car-cover/update-car-cover.component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.getCoverTypes();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  exportToExcel(): void {
    const element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Exclude the last two columns from exporting
    const excludedColumns = [8, 9]; // Column indices to exclude
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      excludedColumns.forEach((columnIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: columnIndex });
        delete worksheet[cellAddress];
      });
    }

    // Get the selected cover type value
    const selectedCoverType = this.carCover!.map((cover) => cover.type);

    // console.log(selectedCoverType);

    const updateWorksheetWithCoverType = (
      worksheet: XLSX.WorkSheet,
      coverTypeValues: (string | undefined)[]
    ): void => {
      const range = XLSX.utils.decode_range(worksheet['!ref']!);
      const coverTypeColumnIndex = 3; // Index of the column to update with cover type description

      for (let R = range.s.r + 1; R <= range.e.r; R++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: R,
          c: coverTypeColumnIndex,
        });
        const coverType = coverTypeValues[R - 1];
        worksheet[cellAddress] = { v: coverType || '', w: coverType || '' };
      }
    };

    updateWorksheetWithCoverType(worksheet, selectedCoverType);

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
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
          // console.log(res);
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
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
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
      console.log(this.updatedCoverValues);
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
    console.log(this.updatedCoverValues);
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
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
}
