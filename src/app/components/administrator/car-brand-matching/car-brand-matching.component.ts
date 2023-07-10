import { DatePipe } from '@angular/common';
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
    this.dateFormatterService();
    this.getCompaniesPerUser();
    // this.getDico();
    this.getBrandMatchingLov();
    this.userRolesService.getUserRoles();
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
        this.alertifyService.dialogAlert('Error');
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