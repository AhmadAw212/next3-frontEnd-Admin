import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CaseMngrSetup } from 'src/app/model/case-mngr-setup';
import { AddCaseMngrSetupComponent } from './add-case-mngr-setup/add-case-mngr-setup.component';
@Component({
  selector: 'app-cars-case-mngr-setup',
  templateUrl: './cars-case-mngr-setup.component.html',
  styleUrls: ['./cars-case-mngr-setup.component.css'],
})
export class CarsCaseMngrSetupComponent implements OnInit {
  dico?: any;
  selectedRow!: HTMLElement;
  dateFormats?: any;
  isLoading?: boolean = false;
  caseMngrSetup?: CaseMngrSetup[];
  updatedCaseMngr: CaseMngrSetup[] = [];
  showCarsCell?: boolean = false;
  selectedCaseMngr?: CaseMngrSetup;
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
  }
  showCell(selectedCase: CaseMngrSetup) {
    this.selectedCaseMngr = selectedCase;
    this.showCarsCell = true;
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  trackProductById(index: number, caseMngrSetup: CaseMngrSetup) {
    return caseMngrSetup.id;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  exportToExcel() {
    const dico_products_reserve = this.dico.dico_product_reserve;
    const data = this.caseMngrSetup?.map((data) => {
      return {
        ID: data.id,
        Cell: data.cmsCell,
        Type: data.cmsType,
        Description: data.description,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Case Mngr Setup');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'Case_Mngr_Setup.xlsx');
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

  getCaseMngrSetup() {
    this.isLoading = true;
    this.dataService.getCarsCaseMngrSetup().subscribe({
      next: (res) => {
        this.caseMngrSetup = res.data;
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
  deleteCaseMngr(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCaseMngrSetup(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title);
            this.getCaseMngrSetup();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              // this.authService.logout();
              this.alertifyService.dialogAlert(err.error.message);
            }
          },
        });
      }
    );
  }
  onTdBlur(
    event: FocusEvent,
    caseMngr: CaseMngrSetup,
    property: 'description'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = caseMngr[property];
    const newValue = tdElement.innerText.trim();
    const updatedCaseMngr = this.updatedCaseMngr ?? [];

    const index = updatedCaseMngr.findIndex((item) => item.id === caseMngr.id);
    if (index !== -1) {
      updatedCaseMngr.splice(index, 1);
    }
    if (oldValue !== newValue) {
      caseMngr[property] = newValue;
      this.updatedCaseMngr?.push({
        id: caseMngr.id,
        description: caseMngr.description,
      });
      console.log(this.updatedCaseMngr);
    }
  }

  updateCaseMngr() {
    if (this.updatedCaseMngr?.length) {
      this.dataService.updateCaseMngrSetup(this.updatedCaseMngr).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title);
          this.updatedCaseMngr = [];
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }

  openAddCoverRiskDialog() {
    const dialogRef = this.dialog.open(AddCaseMngrSetupComponent, {
      data: {
        dico: this.dico,
      },
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCaseMngrSetup();
    });
  }
}
