import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLanguageComponent } from '../add-dialogs/add-language/add-language.component';
import { DataServiceService } from 'src/app/services/data-service.service';
import { ResourceBundle } from 'src/app/model/resource-bundle';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';

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
  constructor(
    private dialog: MatDialog,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
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
      console.log(this.updatedResourceValues);
    }
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
      this.reportDateTime = this.dateFormatService.reportDateTime;
    });
  }

  openCoreConfigDialog() {
    this.dialog.open(AddLanguageComponent);
  }

  resourceBundleSearch() {
    this.dataService.resourceBundleSearch(this.key, this.value).subscribe({
      next: (data) => {
        this.resourceData = data.data;
        // console.log(data);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
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
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  updateResouce() {
    if (this.updatedResourceValues?.length) {
      this.dataService.editResource(this.updatedResourceValues).subscribe({
        next: (res) => {
          this.alertifyService.dialogAlert(res.title!);
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
}
