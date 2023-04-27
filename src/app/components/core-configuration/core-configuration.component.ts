import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigData } from 'src/app/model/config-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddConfigDialogComponent } from '../add-config-dialog/add-config-dialog.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

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
  dateFormat?: ConfigData[] = [];
  reportDateTimeFormat?: string;
  reportDateTime?: string;

  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
      this.reportDateTime = this.dateFormatService.reportDateTime;
    });
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
        configValue: config.configValue,
        description: config.description,
      });
      console.log(this.updatedConfigValues);
    }
  }

  editConfig() {
    if (this.updatedConfigValues?.length) {
      this.dataService.editConfig(this.updatedConfigValues).subscribe({
        next: (res) => {
          this.alertifyService.success(res.title!);
          console.log(res);
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
            ``;
            this.alertifyService.dialogAlert(res.title!);
            this.coreConfigSearch();
            console.log(res);
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
    this.dataService.coreConfigSearch(this.id, this.description).subscribe({
      next: (data) => {
        this.configData = data.data;
        console.log(this.configData);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  openCoreConfigDialog() {
    this.dialog.open(AddConfigDialogComponent);
  }
}
