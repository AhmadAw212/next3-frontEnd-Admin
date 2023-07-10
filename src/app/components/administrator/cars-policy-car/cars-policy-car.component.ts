import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { CarsPolicyCar } from 'src/app/model/cars-policy-car';
import { CarsbrandMatching } from 'src/app/model/carsbrand-matching';
@Component({
  selector: 'app-cars-policy-car',
  templateUrl: './cars-policy-car.component.html',
  styleUrls: ['./cars-policy-car.component.css'],
})
export class CarsPolicyCarComponent implements OnChanges {
  @Input() dico?: any;
  carsPolicyCar?: CarsPolicyCar[];
  selectedRow!: HTMLElement;
  isLoading?: boolean = false;
  @Input() selectedBrand?: CarsbrandMatching;
  minYear?: number;
  maxYear?: number;
  updatingPolicyCar: CarsPolicyCar[] = [];
  @Input() brandId?: string;
  @Input() trademarkId?: string;
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
  ngOnChanges(changes: SimpleChanges): void {
    // this.getcarsPolicyCar();
  }

  trackById(index: number, brandMatching: any) {
    return brandMatching.dtId;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  highlightRow(event: Event) {
    const clickedField = event.target as HTMLElement;
    const clickedRow = clickedField.closest('tr') as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow;
    this.selectedRow.classList.add('highlight');
  }

  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  exportToExcel() {
    const data = this.carsPolicyCar?.map((data) => {
      return {
        ' Brand Desc': data.carBrandDesc,
        ' Trademark Desc': data.carTrademarkDesc,
        'Brand ID': data.brandId,
        'Trademark ID': data.carTrademarkId,
        'Shape ID': data.carShapeId,
        'Brand Code': data.carBrandCode,
        'Trademark Code': data.carTrademarkCode,
        'Shape Code': data.shape,
        'Policy Number': data.policyNumber,
        'Car Year': data.carYear,
        'Car Chasis': data.carChassis,
        'Car Plate': data.carPlate,
        'Car ID': data.carId,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cars Policy Car');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'cars_policy_car.xlsx');
  }

  getcarsPolicyCar() {
    const modelName = this.selectedBrand?.modelName!;
    this.dataService.getCarsPolicyCar(modelName).subscribe({
      next: (res) => {
        this.carsPolicyCar = res.data.carsPolicyCarResponseList;
        this.minYear = res.data.minYear;
        this.maxYear = res.data.maxYear;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  findAndReplaceExpert(
    updatedBrand: CarsPolicyCar[],
    brandMatch: CarsPolicyCar
  ): void {
    const index = updatedBrand.findIndex(
      (item) => item.carId === brandMatch.carId
    );
    if (index !== -1) {
      updatedBrand.splice(index, 1);
    }

    updatedBrand.push({
      carId: brandMatch.carId,
      brandId: brandMatch.brandId,
      carShapeId: brandMatch.carShapeId,
      carTrademarkId: brandMatch.carTrademarkId,
    });
  }

  onTdDoubleClickBrandId(car: CarsPolicyCar): void {
    const updatedCell = this.updatingPolicyCar ?? [];
    car.brandId = this.brandId;

    this.findAndReplaceExpert(updatedCell, car);
    console.log(this.updatingPolicyCar);
  }
  onTdDoubleClickTrademark(car: CarsPolicyCar): void {
    const updatedCell = this.updatingPolicyCar ?? [];
    car.carTrademarkId = this.trademarkId;

    this.findAndReplaceExpert(updatedCell, car);
    console.log(this.updatingPolicyCar);
  }

  updateExpertFees() {
    if (this.updatingPolicyCar?.length) {
      this.dataService.updateCarsPolicyCar(this.updatingPolicyCar).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title);
          this.updatingPolicyCar = [];
          console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            // this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
}
