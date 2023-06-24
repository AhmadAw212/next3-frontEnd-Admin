import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigData } from 'src/app/model/config-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddConfigDialogComponent } from '../add-dialogs/add-config-dialog/add-config-dialog.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-core-configuration',
  templateUrl: './core-configuration.component.html',
  styleUrls: ['./core-configuration.component.css'],
})
export class CoreConfigurationComponent implements OnInit {
  description: string = '';
  id: string = '';
  configData?: ConfigData[] = [];
  updatedConfigValues?: ConfigData[] = [];
  reportDateTimeFormat?: string;
  selectedConfigId?: string;
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  dico?: any;
  dateFormats?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe
  ) {}
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }

  ngOnInit(): void {
    this.dateFormatterService();
    this.getDico();
  }
  exportToExcel() {
    const data = this.configData?.map((data) => {
      return {
        ID: data.id,
        'Configuration Key': data.configKey,
        'Configuration Value': data.configValue,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Core Configuration');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Core_Config.xlsx');
  }
  getDico() {
    this.dicoService.getDico();
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
  trackConfigById(index: number, config: any): string {
    return config.id;
  }
  onTdBlur(
    event: FocusEvent,
    config: ConfigData,
    property: 'configValue' | 'description'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = config[property];
    const newValue = tdElement.innerText.trim();

    if (oldValue !== newValue) {
      config[property] = newValue;
      this.updatedConfigValues?.push({
        id: config.id,
        configKey: config.configKey,
        configValue: config.configValue,
        description: config.description,
      });
      // console.log(this.updatedConfigValues);
    }
  }

  editConfig() {
    if (this.updatedConfigValues?.length) {
      this.dataService.editConfig(this.updatedConfigValues).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title!);
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }

  deleteConfig(configId: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete the configuration',
      () => {
        const config = [configId];
        this.dataService.deleteConfig(config).subscribe({
          next: (res) => {
            this.alertifyService.success(res.title);
            this.coreConfigSearch();
            // console.log(res);
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  coreConfigSearch() {
    this.isLoading = true;
    this.dataService.coreConfigSearch(this.id, this.description).subscribe({
      next: (data) => {
        this.configData = data.data;
        // console.log(this.configData);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  openCoreConfigDialog() {
    const dialogRef = this.dialog.open(AddConfigDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.coreConfigSearch();
    });
  }
  // updateCoreConfigDialog(coreConfig: ConfigData) {
  //   const dialogRef = this.dialog.open(UpdateCoreConfigurationComponent, {
  //     data: coreConfig,
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.coreConfigSearch();
  //   });
  // }
}
