import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarsReportList } from 'src/app/model/cars-report-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddReportListComponent } from '../add-dialogs/add-report-list/add-report-list.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-cars-report-list',
  templateUrl: './cars-report-list.component.html',
  styleUrls: ['./cars-report-list.component.css'],
})
export class CarsReportListComponent implements OnInit {
  role?: string = '';
  sql?: string = '';
  carReport?: CarsReportList[];
  expandedSql?: string;
  isSqlExpanded: boolean = false;
  reportDateTimeFormat?: string;
  updateCarReportList: CarsReportList[] = [];
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getDico();
  }
  exportToExcel() {
    const data = this.carReport?.map((data) => {
      return {
        ID: data.id,
        Report: data.report,
        Role: data.role,
        Query: data.sql,
        Sheet: data.sheet,
        Order: data.order,
        File: data.file,
        'File Extension': data.fileExtension,
        Directory: data.directory,
        Email: data.email,
        'Email Done': data.emailDone,
        Notes: data.notes,
        'Created Date': data.sysCreatedDate,
        'Created By': data.sysCreatedBy,
        'Updated Date': data.sysUpdatedDate,
        'Updated By': data.sysUpdatedBy,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report List');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Report_List.xlsx');
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  trackReportListById(index: number, report: CarsReportList) {
    return report.id;
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
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

  searchCarReport() {
    this.dataService.searchCarReportList(this.role!, this.sql!).subscribe({
      next: (res) => {
        this.carReport = res.data;
        // console.log(res);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
          this.alertifyService.error(err.error.message);
        }
      },
    });
  }

  onTdBlur(
    event: FocusEvent,
    reportList: CarsReportList,
    property:
      | 'report'
      | 'role'
      | 'sql'
      | 'sheet'
      | 'order'
      | 'fileExtension'
      | 'notes'
      | 'directory'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = reportList[property];
    let newValue: any = tdElement.innerText.trim();

    if (property === 'order') {
      newValue = parseInt(newValue, 10); // Parse the value as an integer
    }

    const updateCarReportList = this.updateCarReportList ?? [];

    const index = updateCarReportList.findIndex(
      (item) => item.id === reportList.id
    );
    if (index !== -1) {
      updateCarReportList.splice(index, 1);
    }

    const file = reportList.file ?? false;
    const email = reportList.email ?? false;
    const emailDone = reportList.emailDone ?? false;
    if (oldValue !== newValue) {
      reportList[property] = newValue;
      this.updateCarReportList?.push({
        id: reportList.id,
        report: reportList.report,
        role: reportList.role,
        sql: reportList.sql,
        sheet: reportList.sheet,
        order: reportList.order,
        file: file,
        fileExtension: reportList.fileExtension,
        directory: reportList.directory,
        email: email,
        emailDone: emailDone,
        notes: reportList.notes,
      });
      // console.log(this.updateCarReportList);
    }
  }

  onCheckboxChange(reportList: CarsReportList) {
    const file = reportList.file ?? false;
    const email = reportList.email ?? false;
    const emailDone = reportList.emailDone ?? false;
    const updateCarReportList = this.updateCarReportList ?? [];
    const index = updateCarReportList.findIndex(
      (item) => item.id === reportList.id
    );
    if (index !== -1) {
      updateCarReportList.splice(index, 1);
    }
    this.updateCarReportList?.push({
      id: reportList.id,
      report: reportList.report,
      role: reportList.role,
      sql: reportList.sql,
      sheet: reportList.sheet,
      order: reportList.order,
      file: file,
      fileExtension: reportList.fileExtension,
      directory: reportList.directory,
      email: email,
      emailDone: emailDone,
      notes: reportList.notes,
    });
    console.log(this.updateCarReportList);
  }

  deleteCarReportList(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarReportList(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarReport();
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  updateReportList() {
    if (this.updateCarReportList?.length) {
      this.dataService.updateCarReportList(this.updateCarReportList).subscribe({
        next: (res) => {
          const modifiedFields = document.querySelectorAll('.updated-row');
          modifiedFields.forEach((field) => {
            field.classList.remove('updated-row');
          });

          this.alertifyService.success(res.message!);
          this.updateCarReportList = [];

          console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
  openAddReportListDialog() {
    this.dialog.open(AddReportListComponent, { maxHeight: '600px' });
  }
}
