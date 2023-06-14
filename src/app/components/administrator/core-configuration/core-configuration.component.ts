import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigData } from 'src/app/model/config-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddConfigDialogComponent } from '../add-dialogs/add-config-dialog/add-config-dialog.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { UpdateCoreConfigurationComponent } from '../update-dialogs/update-core-configuration/update-core-configuration.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

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
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService
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
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getDico();
  }
 getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
      // this.reportDateTime = this.dateFormatService.reportDateTime;
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
