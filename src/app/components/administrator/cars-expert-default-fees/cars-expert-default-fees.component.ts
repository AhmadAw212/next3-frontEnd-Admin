import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { ExpertDefaultFees } from 'src/app/model/expert-default-fees';
import { AddExpertFeesComponent } from './add-expert-fees/add-expert-fees.component';
@Component({
  selector: 'app-cars-expert-default-fees',
  templateUrl: './cars-expert-default-fees.component.html',
  styleUrls: ['./cars-expert-default-fees.component.css'],
})
export class CarsExpertDefaultFeesComponent implements OnInit {
  selectedRow!: HTMLElement;
  dico?: any;
  dateFormats?: any;
  expertDefaultFees?: ExpertDefaultFees[];
  company?: string;
  companies?: CompanyBranchList[];
  isLoading?: boolean = false;
  currency?: any;
  updatedExpertFees: ExpertDefaultFees[] = [];
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
    this.getDico();
    // this.dateFormatterService();
    // this.userRolesService.getUserRoles();
    this.getCompaniesPerUser();
    this.getCurrency();
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

  trackCoverById(index: number, ExpertDefaultFees: ExpertDefaultFees) {
    return ExpertDefaultFees.id;
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
    const data = this.expertDefaultFees?.map((data) => {
      return {
        ID: data.id,
        'From Hour': data.fromHour,
        'To Hour': data.toHour,
        Currency: data.currency,
        'Default Access Fess Amount': data.defaultAccessFessAmount,
        // Company: cover.insuranceDesc,
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

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expert Default Fees');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert the buffer to a Blob and save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Expert_Fees.xlsx');
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

  getCurrency() {
    this.dataService.getCurrencies().subscribe({
      next: (data) => {
        this.currency = data.data;
        console.log(this.currency);
      },
    });
  }
  getCarExpertDefaultFees() {
    this.isLoading = true;
    this.dataService.getCarsExpertDefaultFees(this.company!).subscribe({
      next: (res) => {
        this.expertDefaultFees = res.data;
        console.log(res);
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
  onDropdownChange(
    event: Event,
    expertFees: ExpertDefaultFees,
    property: 'currency'
  ) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedExpertFees = this.updatedExpertFees ?? [];
    const index = updatedExpertFees.findIndex(
      (item) => item.id === expertFees.id
    );
    if (index !== -1) {
      updatedExpertFees.splice(index, 1);
    }
    this.updatedExpertFees?.push({
      id: expertFees.id,
      insuranceId: expertFees.insuranceId,

      defaultAccessFessAmount: expertFees.defaultAccessFessAmount,
      currency: expertFees.currency,
    });
    console.log(this.updatedExpertFees);
  }

  onTdBlur(
    event: FocusEvent,
    expertFees: ExpertDefaultFees,
    property: 'defaultAccessFessAmount'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = expertFees[property];
    const newValue = tdElement.innerText.trim();
    const updatedExpertFees = this.updatedExpertFees ?? [];

    const index = updatedExpertFees.findIndex(
      (item) => item.id === expertFees.id
    );
    if (index !== -1) {
      updatedExpertFees.splice(index, 1);
    }
    if (oldValue !== parseFloat(newValue)) {
      expertFees[property] = parseFloat(newValue);
      this.updatedExpertFees?.push({
        id: expertFees.id,
        insuranceId: expertFees.insuranceId,

        defaultAccessFessAmount: expertFees.defaultAccessFessAmount,
        currency: expertFees.currency,
      });
      console.log(this.updatedExpertFees);
    }
  }
  updateExpertFees() {
    if (this.updatedExpertFees?.length) {
      this.dataService.updateExpertFees(this.updatedExpertFees).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title);
          this.updatedExpertFees = [];
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

  openAddExpertFeesDialog() {
    const dialogRef = this.dialog.open(AddExpertFeesComponent, {
      data: { dico: this.dico, company: this.company, currency: this.currency },
      width: '350px',
      // maxHeight: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCarExpertDefaultFees();
    });
  }

  deleteCarCover(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteExpertFees(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.getCarExpertDefaultFees();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              //this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }
}
