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
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-core-configuration',
  templateUrl: './core-configuration.component.html',
  styleUrls: ['./core-configuration.component.css'],
})
export class CoreConfigurationComponent implements OnInit {
  description: string = '';
  id: string = '';
  configData?: ConfigData[] = [];
  updatedConfigValues: ConfigData[] = [];
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
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService,
    private messageService: MessageService
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
    // this.dateFormatterService();
    this.getDico();
    // this.userRolesService.getUserRoles();
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
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
    // this.dicoService.getDico();
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
  findAndReplaceExpert(
    updatedConfig: ConfigData[],
    coreconfig: ConfigData
  ): void {
    const index = updatedConfig.findIndex((item) => item.id === coreconfig.id);
    if (index !== -1) {
      updatedConfig.splice(index, 1);
    }

    updatedConfig.push({
      id: coreconfig.id,
      description: coreconfig.description,
      configValue: coreconfig.configValue,
      configKey: coreconfig.configKey,
    });
  }
  onTdBlur(
    event: FocusEvent,
    config: ConfigData,
    property: 'configValue' | 'description' | 'configKey'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = config[property];
    const newValue = tdElement.textContent?.trim() || '';
    const updatedConfig = this.updatedConfigValues ?? [];

    if (oldValue !== newValue) {
      const updatedConfigItem = { ...config, [property]: newValue };
      this.findAndReplaceExpert(updatedConfig, updatedConfigItem);
      // console.log(this.updatedConfigValues);
    }
  }

  editConfig() {
    if (this.updatedConfigValues?.length) {
      this.dataService.editConfig(this.updatedConfigValues).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title!);
          this.messageService.add({
            severity: 'success',
            summary: 'Configuration Edited Successfully',
            detail: res.title,
          });
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
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
            this.messageService.add({
              severity: 'error',
              summary: 'Configuration Deleted Successfully',
              detail: res.title,
            });
            this.coreConfigSearch();
            // console.log(res);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
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
        this.alertifyService.error(err.error.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  openCoreConfigDialog() {
    const dialogRef = this.dialog.open(AddConfigDialogComponent);
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.coreConfigSearch();
      }
    });
  }
}
