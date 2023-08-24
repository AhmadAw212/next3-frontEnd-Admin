import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { CarProducts } from 'src/app/model/car-products';
import { CarsbrandMatching } from 'src/app/model/carsbrand-matching';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { AddbrandMatchingComponent } from './addbrand-matching/addbrand-matching.component';
enum Show {
  ALL = 'ALL',
  'NOT MATCHED' = 'NOTMATCHED',
  'MODEL ZZZZ' = 'MODELZZZZ',
  MATCHED = 'MATCHED',
}
@Component({
  selector: 'app-car-brand-matching',
  templateUrl: './car-brand-matching.component.html',
  styleUrls: ['./car-brand-matching.component.css'],
})
export class CarBrandMatchingComponent implements OnInit {
  reportDateTimeFormat?: string;
  companies?: CompanyBranchList[];
  selectedRow!: HTMLElement;
  @Input() dico?: any;
  isLoading?: boolean = false;
  dateFormats?: any;
  company?: string;
  selectedShow?: Show;
  showOptions?: type[];
  insuranceCode?: string;
  @Input() brandId?: string;
  carModelMatch?: CarsbrandMatching[];
  makeCode: string = '';
  modelName: string = '';
  @Input() selectedTrademarkId?: string;
  updatedBrandMatching: CarsbrandMatching[] = [];
  selectedCarsPolicyCar?: CarsbrandMatching;
  showPolicyCar?: boolean = false;
  date?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {
    //
  }
  ngOnInit(): void {
    // this.dateFormatterService();
    this.getCompaniesPerUser();
    // this.getDico();
    this.date = new Date();
    // this.date = formatDate(currentDate, 'dd/MM/yyyy', 'en')!;
    this.getBrandMatchingLov();
    // this.userRolesService.getUserRoles();
  }
  showCarsPolicyCar(selectedbrand: CarsbrandMatching) {
    this.showPolicyCar = true;
    this.selectedCarsPolicyCar = selectedbrand;
  }
  trackByBrandId(index: number, brandMatching: CarsbrandMatching) {
    return brandMatching.dtId;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  exportToExcel() {
    const data = this.carModelMatch?.map((data) => {
      return {
        ID: data.dtId,
        ' Model Code': data.insModelCode,
        ' Make Code': data.insMakeCode,
        'Model Name': data.modelName,
        'Brand Id': data.brandId,
        'Trademark Id': data.trademarkId,

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Model Matching');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'Model_Matching.xlsx');
  }
  getDico() {
    // this.isLoading = true;
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
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

  dateFormatterService() {
    this.dateFormatService.dateFormatter();
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

  getBrandMatchingLov() {
    this.dataService.getBrandMatchingLov().subscribe({
      next: (res) => {
        this.showOptions = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  findAndReplaceExpert(
    updatedBrand: CarsbrandMatching[],
    brandMatch: CarsbrandMatching
  ): void {
    const index = updatedBrand.findIndex(
      (item) => item.dtId === brandMatch.dtId
    );
    if (index !== -1) {
      updatedBrand.splice(index, 1);
    }

    updatedBrand.push({
      dtId: brandMatch.dtId,
      insId: brandMatch.insId,
      brandId: brandMatch.brandId,
      insMakeCode: brandMatch.insMakeCode,
      trademarkId: brandMatch.trademarkId,
      insModelCode: brandMatch.insModelCode,
      modelName: brandMatch.modelName,
    });
  }

  onDropdownChange(
    event: Event,
    brandMatching: CarsbrandMatching,
    property: 'insId'
  ): void {
    const updatedCell = this.updatedBrandMatching ?? {};

    this.findAndReplaceExpert(updatedCell, brandMatching);

    // console.log(this.updatedBrandMatching);
  }
  onTdDoubleClickBrandId(car: CarsbrandMatching): void {
    const updatedCell = this.updatedBrandMatching ?? [];
    car.brandId = this.brandId;

    this.findAndReplaceExpert(updatedCell, car);
    // console.log(this.updatedBrandMatching);
  }

  onTdDoubleClickTrademarkId(car: CarsbrandMatching) {
    const updatedCell = this.updatedBrandMatching ?? [];
    car.trademarkId = this.selectedTrademarkId;
    this.findAndReplaceExpert(updatedCell, car);
    // console.log(this.updatedBrandMatching);
  }

  onTdBlur(
    event: FocusEvent,
    car: CarsbrandMatching,
    property: keyof CarsbrandMatching
  ): void {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = car[property];
    const newValue = tdElement.innerText.trim();
    const updatedCell = this.updatedBrandMatching ?? [];

    if (oldValue !== newValue) {
      car[property] = newValue;

      this.findAndReplaceExpert(updatedCell, car);

      // console.log(this.updatedBrandMatching);
    }
  }

  updateProductReserve() {
    if (this.updatedBrandMatching?.length) {
      this.dataService.updateCarDtModels(this.updatedBrandMatching).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title);
          this.updatedBrandMatching = [];

          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  openAddBrandDialog() {
    const dialogRef = this.dialog.open(AddbrandMatchingComponent, {
      data: {
        dico: this.dico,
        company: this.company,
        brandId: this.brandId,
        trademarkId: this.selectedTrademarkId,
      },
      width: '350px',
      // maxHeight: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarModel();
    });
  }
  deleteBrand(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarDtModels(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title);
            this.searchCarModel();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    );
  }
  searchCarModel() {
    this.isLoading = true;

    this.dataService
      .searchCarModels(
        this.company!,
        this.makeCode!,
        this.modelName!,
        this.selectedShow!
      )
      .subscribe({
        next: (res) => {
          this.carModelMatch = res.data;
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  UpdateSerialBrand() {
    // const date = this.datePipe.transform(this.date, 'dd-MM-yyyy')!;
    // const formattedDate = formatDate(this.date!, 'dd/MM/yyyy', 'en-US');
    this.date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
    console.log(this.date);
    this.dataService
      .updateBrandSerial(
        this.company!,
        this.date!,
        this.brandId!,
        this.modelName!
      )
      .subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
}
