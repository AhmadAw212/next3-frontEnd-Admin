import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarBrandDialogComponent } from '../add-dialogs/add-car-brand-dialog/add-car-brand-dialog.component';
import { UpdateCarDialogComponent } from '../update-dialogs/update-car-dialog/update-car-dialog.component';
import { CarTrademark } from 'src/app/model/car-trademark';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-cars-brand',
  templateUrl: './cars-brand.component.html',
  styleUrls: ['./cars-brand.component.css'],
})
export class CarsBrandComponent implements OnInit {
  description: string = '';
  code: string = '';
  carsBrandData?: CarsBrand[];
  file?: File;
  carBrandData?: CarsBrand;
  carTrademark?: CarTrademark[];
  showTrademark = false;
  reportDateTimeFormat?: string;
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  dico?: any;
  dateFormats?: any;
  brandId?: string;
  selectedTrademarkId?: string;
  showBrandMatchingTable?: boolean = true;

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
    // this.dateFormatterService();
    this.getDico();
    // this.userRolesService.getUserRoles();
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  savebrandId(brand: CarsBrand) {
    this.brandId = brand.carBrandId;
  }
  selectTrademarkId(data: string) {
    this.selectedTrademarkId = data;
    console.log(this.selectedTrademarkId);
  }

  exportToExcel() {
    const data = this.carsBrandData?.map((data) => {
      return {
        ID: data.carBrandId,
        Code: data.carBrandCode,
        Description: data.carBrandDescription,
        'Created Date': this.datePipe.transform(
          data.sysCreatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.sysCreatedBy,
        'Updated Date': this.datePipe.transform(
          data.sysUpdatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': data.sysUpdatedBy,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cars Brands');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Cars_Brands.xlsx');
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  trackBrandById(index: number, brand: CarsBrand) {
    return brand.carBrandId;
  }
  // showTrademarkList() {}
  highlightRow(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedRow = clickedElement.closest('tr');

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow!;
    this.selectedRow.classList.add('highlight');
  }
  carsBrandSearch() {
    this.showTrademark = false;
    this.isLoading = true;
    this.dataService.carsBrandSearch(this.code, this.description).subscribe({
      next: (data) => {
        this.carsBrandData = data.data.map((res: CarsBrand) => {
          // console.log(`data:image/jpeg;base64,${res.content}`);
          return {
            ...res,
            content: `data:image/jpeg;base64,${res.content}`,
          };
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  carsTrademarkSearch(id: string, brand: CarsBrand) {
    if (brand.carBrandId !== this.carBrandData?.carBrandId) {
      this.showTrademark = false;
    }
    this.carBrandData = brand;
    this.dataService.carsTrademarkByCarId(id).subscribe({
      next: (res) => {
        this.carTrademark = res.data.map((res: CarTrademark) => {
          return {
            ...res,
            logo: `data:image/jpeg;base64,${res.logo}`,
          };
        });
        if (brand.carBrandId === this.carBrandData?.carBrandId) {
          this.showTrademark = true;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteCarBrand(code: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarBrand(code).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title!);
            this.carsBrandSearch();
            // console.log(data);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
  }
  openAddCarBrandDialog() {
    this.dialog.open(AddCarBrandDialogComponent);
  }

  updateCarBrandDialog(car: CarsBrand) {
    const dialogRef = this.dialog.open(UpdateCarDialogComponent, {
      data: car,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.carsBrandSearch();
      this.showTrademark = true;
    });
  }
}
