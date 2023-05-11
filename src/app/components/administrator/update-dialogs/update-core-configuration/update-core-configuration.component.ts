import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ConfigData } from 'src/app/model/config-data';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

@Component({
  selector: 'app-update-core-configuration',
  templateUrl: './update-core-configuration.component.html',
  styleUrls: ['./update-core-configuration.component.css'],
})
export class UpdateCoreConfigurationComponent {
  configValue?: string;
  description?: string;
  id?: string;
  selectedCoreConfig: ConfigData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateCoreConfigurationComponent>,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {
    this.selectedCoreConfig = this.data;
    this.id = this.selectedCoreConfig.id;
    this.configValue = this.selectedCoreConfig.configValue;
    this.description = this.selectedCoreConfig.description;
    console.log(data);
  }

  updateCoreConfig() {
    const updateCoreConfig: ConfigData = {
      id: this.id,
      description: this.description,
      configValue: this.configValue,
    };
    this.dataService.editConfig([updateCoreConfig]).subscribe({
      next: (res) => {
        this.alertifyService.success(res.title!);
        this.dialogRef.close();
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
