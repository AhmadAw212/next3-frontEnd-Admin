import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLanguageComponent } from '../add-dialogs/add-language/add-language.component';
import { DataServiceService } from 'src/app/services/data-service.service';
import { ResourceBundle } from 'src/app/model/resource-bundle';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-language-config',
  templateUrl: './language-config.component.html',
  styleUrls: ['./language-config.component.css'],
})
export class LanguageConfigComponent implements OnInit {
  key: string = '';
  value: string = '';
  resourceData?: ResourceBundle[] = [];
  reportDateTimeFormat?: string;
  reportDateTime?: string;
  updatedResourceValues?: ResourceBundle[] = [];
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  dico?: any;
  dateFormats?: any;
  constructor(
    private dialog: MatDialog,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
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
  exportToExcel() {
    const data = this.resourceData?.map((data) => {
      return {
        ID: data.id,
        Locale: data.locale,
        'Language Key': data.resourceKey,
        'Language Value': data.resourceValue,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Language Configuration');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Language_Config.xlsx');
  }

  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  trackLangById(index: number, lang: any): string {
    return lang.id;
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  onTdBlur(
    event: FocusEvent,
    resource: ResourceBundle,
    property: 'resourceKey' | 'resourceValue'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = resource[property];
    const newValue = tdElement.innerText.trim();

    if (oldValue !== newValue) {
      resource[property] = newValue;
      this.updatedResourceValues?.push({
        id: resource.id,
        resourceKey: resource.resourceKey,
        resourceValue: resource.resourceValue,
      });
      // console.log(this.updatedResourceValues);
    }
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  openCoreConfigDialog() {
    const dialogRef = this.dialog.open(AddLanguageComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.resourceBundleSearch();
    });
  }

  resourceBundleSearch() {
    this.isLoading = true;
    this.dataService.resourceBundleSearch(this.key, this.value).subscribe({
      next: (data) => {
        this.resourceData = data.data;
        // console.log(data);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
      complete: () => {
        console.log('HTTP request completed');
        this.isLoading = false;
      },
    });
  }

  deleteResource(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteResource(id).subscribe({
          next: (data) => {
            this.alertifyService.dialogAlert(data.message!);
            this.resourceBundleSearch();
            // console.log(data);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
          },
        });
      }
    );
  }

  updateResouce() {
    if (this.updatedResourceValues?.length) {
      this.dataService.editResource(this.updatedResourceValues).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
    }
  }
}
