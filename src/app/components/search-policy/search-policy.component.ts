import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { type } from 'src/app/model/type';
import { Policy } from 'src/app/model/policy';
@Component({
  selector: 'app-search-policy',
  templateUrl: './search-policy.component.html',
  styleUrls: ['./search-policy.component.css'],
})
export class SearchPolicyComponent {
  dico?: any;
  selectedRow!: HTMLElement;
  policies?: any;
  policySearchSubscribtion?: Subscription;
  policySearch?: type[];
  getInsuranceSubscription?: Subscription;
  insurance?: any[];
  policyTypeSubscription?: Subscription;
  policyType?: type[];
  searchByValue?: string = '';
  policyTypeValue?: string = '';
  searchValue?: string = '';
  insuranceValue?: string = 'ALL';
  asOfDateValue?: Date;
  policyResult?: Policy[];
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
    // Step 1: Parse the date string in Angular to get a JavaScript Date object
    this.asOfDateValue = new Date();
  }
  ngOnInit(): void {
    // this.dateFormatterService();
    this.getDico();
    // this.userRolesService.getUserRoles();
    this.policySearchLov();
    this.getInsuranceLovFindAll();
    this.getPolicyTypeLovFindAll();
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
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  exportToExcel() {
    const data = this.policies?.map((data: any) => {
      return {
        ID: data.id,
        Code: data.code,
        Description: data.description,
        Type: data.coverTypeDescription,
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

  policySearchLov() {
    this.policySearchSubscribtion = this.dataService
      .policySearchLov()
      .subscribe({
        next: (res) => {
          this.policySearch = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
  getInsuranceLovFindAll() {
    this.getInsuranceSubscription = this.dataService
      .getInsuranceLovFindAll()
      .subscribe({
        next: (res) => {
          this.insurance = res.data;
          const newRecord = {
            insuranceCode: 'ALL',
            insuranceDesc: 'ALL',
          };
          this.insurance?.push(newRecord);
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
  getPolicyTypeLovFindAll() {
    this.policyTypeSubscription = this.dataService
      .getPolicyTypeLovFindAll()
      .subscribe({
        next: (res) => {
          this.policyType = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
  searchPolicy() {
    const formattedDate = this.datePipe.transform(
      this.asOfDateValue,
      'dd-MMM-YYYY'
    );

    this.dataService
      .searchPolicy(
        this.searchByValue!,
        this.searchValue!,
        this.policyTypeValue!,
        formattedDate!,
        this.insuranceValue!,
        ''
      )
      .subscribe({
        next: (res) => {
          this.policyResult = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
