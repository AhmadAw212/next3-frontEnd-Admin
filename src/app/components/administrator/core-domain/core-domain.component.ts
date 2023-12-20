import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreDomain } from 'src/app/model/core-domain';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddDomainDialogComponent } from '../add-dialogs/add-domain-dialog/add-domain-dialog.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { CoreDomainValue } from 'src/app/model/core-domain-value';
import { DicoServiceService } from 'src/app/services/dico-service.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-core-domain',
  templateUrl: './core-domain.component.html',
  styleUrls: ['./core-domain.component.css'],
})
export class CoreDomainComponent implements OnInit {
  code: string = '';
  description: string = '';
  domainData?: CoreDomain[] = [];
  sysActiveFlag?: number;
  reportDateTimeFormat?: string;
  updatedDomainValues?: CoreDomain[] = [];
  domain?: CoreDomain;
  domainValuesList?: CoreDomainValue[];
  showDomainValue?: boolean = false;
  selectedRow!: HTMLElement;
  isLoading?: boolean = false;
  dico?: any;
  loading: boolean = false;
  dateFormats?: any;
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {}
  highlightRow(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedRow = clickedElement.closest('tr');

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow!;
    this.selectedRow.classList.add('highlight');
  }
  ngOnInit(): void {
    this.dateFormatterService();
    this.getDico();
    // this.userRolesService.getUserRoles();
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  exportToExcel() {
    const data = this.domainData?.map((data) => {
      return {
        ID: data.id,
        Code: data.code,
        Description: data.description,
        'Preference Code': data.preference_code,
        'Created Date': this.datePipe.transform(
          data.createdDate,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.createdBy,
        'Updated Date': this.datePipe.transform(
          data.updateDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': data.updatedBy,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Core Domain Configuration'
    );

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Core_Domain.xlsx');
  }

  exportDomainValueToExcel() {
    const data = this.domainValuesList?.map((data) => {
      return {
        ID: data.id,
        Code: data.code,
        Description: data.description,
        'Value 1': data.val1,
        'Value 2': data.val2,
        'Value 3': data.val3,
        'Value 4': data.val4,
        'Value 5': data.val5,
        'Value 6': data.val6,
        'Value 7': data.val7,
        'Value 8': data.val8,
        'Value 9': data.val9,
        'Value 10': data.val10,
        'Value 11': data.val11,
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
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Core Domain Value Configuration'
    );

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Core_Domain_Value.xlsx');
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
  trackDomainById(index: number, domain: any): string {
    return domain.id;
  }
  onTdBlur(
    event: FocusEvent,
    domain: CoreDomain,
    property: 'code' | 'description' | 'preference_code'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = domain[property];
    const newValue = tdElement.innerText.trim();
    const updatedDomainValues = this.updatedDomainValues ?? [];

    const index = updatedDomainValues.findIndex(
      (item) => item.id === domain.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    const sysActiveFlag = domain.sysActiveFlag ?? false;
    if (oldValue !== newValue) {
      domain[property] = newValue;
      this.updatedDomainValues?.push({
        id: domain.id,
        code: domain.code,
        description: domain.description,
        preference_code: domain.preference_code,
        sysActiveFlag,
      });
      // console.log(this.updatedDomainValues);
    }
  }

  onCheckboxChange(domain: CoreDomain) {
    const sysActiveFlag = domain.sysActiveFlag ?? false;
    const updatedDomainValues = this.updatedDomainValues ?? [];
    const index = updatedDomainValues.findIndex(
      (item) => item.id === domain.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    this.updatedDomainValues?.push({
      id: domain.id,
      code: domain.code,
      description: domain.description,
      preference_code: domain.preference_code,
      sysActiveFlag,
    });
    // console.log(this.updatedDomainValues);
  }

  getDomainValuesData(id: string, domain: CoreDomain) {
    this.loading = true;
    // console.log(domain);
    this.showDomainValue = true;
    this.domain = domain;
    this.dataService.coreDomainValue(id).subscribe({
      next: (res) => {
        this.domainValuesList = res.data;
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  coreDomainSearch() {
    this.loading = true;
    this.showDomainValue = false;

    this.dataService.coreDomainSearch(this.code, this.description).subscribe({
      next: (res) => {
        this.domainData = res.data;
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  deleteResource(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteDomain(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.coreDomainSearch();
            // console.log(data);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
          },
        });
      }
    );
  }

  updateDomain() {
    if (this.updatedDomainValues?.length) {
      this.dataService.updateDomain(this.updatedDomainValues).subscribe({
        next: (res) => {
          this.alertifyService.dialogAlert(res.title!, 'Success');
          this.updatedDomainValues = [];
          console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
    }
  }

  openAddDomainDialog() {
    const dialogRef = this.dialog.open(AddDomainDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.coreDomainSearch();
      }
    });
  }
}
