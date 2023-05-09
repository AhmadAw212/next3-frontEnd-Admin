import { Component, Input, OnInit } from '@angular/core';
import { CoreDomain } from 'src/app/model/core-domain';
import { CoreDomainValue } from 'src/app/model/core-domain-value';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddDomainValueDialogComponent } from '../add-domain-value-dialog/add-domain-value-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

@Component({
  selector: 'app-core-domain-value',
  templateUrl: './core-domain-value.component.html',
  styleUrls: ['./core-domain-value.component.css'],
})
export class CoreDomainValueComponent implements OnInit {
  @Input() domainValues?: CoreDomainValue[];
  @Input() domain?: CoreDomain;
  updatedDomainValues?: CoreDomainValue[] = [];
  code: string = '';
  description: string = '';
  reportDateTimeFormat?: string;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }

  domainValueSearch() {
    const id = this.domain?.id!;
    this.dataService
      .coreDomainValueSearch(id, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.domainValues = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onTdBlur(
    event: FocusEvent,
    domainValue: CoreDomainValue,
    property:
      | 'code'
      | 'description'
      | 'val1'
      | 'val2'
      | 'val3'
      | 'val4'
      | 'val5'
      | 'val6'
      | 'val7'
      | 'val8'
      | 'val9'
      | 'val10'
      | 'coreDomainId'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = domainValue[property];
    const newValue = tdElement.innerText.trim();
    const updatedDomainValues = this.updatedDomainValues ?? [];

    const index = updatedDomainValues.findIndex(
      (item) => item.id === domainValue.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    const sysActiveFlag = domainValue.sysActiveFlag ?? false;
    if (oldValue !== newValue) {
      domainValue[property] = newValue;
      this.updatedDomainValues?.push({
        id: domainValue.id,
        code: domainValue.code,
        description: domainValue.description,
        val1: domainValue.val1,
        val2: domainValue.val2,
        val3: domainValue.val3,
        val4: domainValue.val4,
        val5: domainValue.val5,
        val6: domainValue.val6,
        val7: domainValue.val7,
        val8: domainValue.val8,
        val9: domainValue.val9,
        val10: domainValue.val10,
        coreDomainId: domainValue.coreDomainId,
        sysActiveFlag,
      });
      console.log(this.updatedDomainValues);
    }
  }

  onCheckboxChange(domainValue: CoreDomainValue) {
    const sysActiveFlag = domainValue.sysActiveFlag ?? false;
    const updatedDomainValues = this.updatedDomainValues ?? [];
    const index = updatedDomainValues.findIndex(
      (item) => item.id === domainValue.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    this.updatedDomainValues?.push({
      id: domainValue.id,
      code: domainValue.code,
      description: domainValue.description,
      val1: domainValue.val1,
      val2: domainValue.val2,
      val3: domainValue.val3,
      val4: domainValue.val4,
      val5: domainValue.val5,
      val6: domainValue.val6,
      val7: domainValue.val7,
      val8: domainValue.val8,
      val9: domainValue.val9,
      val10: domainValue.val10,
      coreDomainId: domainValue.coreDomainId,
      sysActiveFlag,
    });
    console.log(this.updatedDomainValues);
  }

  openAddDomainValueDialog() {
    const dialogData = {
      domainId: this.domain?.id,
      domainValues: this.domainValues,
    };
    const dialogRef = this.dialog.open(AddDomainValueDialogComponent, {
      data: dialogData,
      maxHeight: '500px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.domainValues = dialogData.domainValues;
    });
  }

  getDomainValuesData(id: string) {
    this.dataService.coreDomainValue(id).subscribe({
      next: (res) => {
        this.domainValues = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteDomainValue(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteDomainValue(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.getDomainValuesData(this.domain?.id!);
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

  updateDomainValue() {
    if (this.updatedDomainValues?.length) {
      this.dataService
        .updateCoreDomainValue(this.updatedDomainValues)
        .subscribe({
          next: (res) => {
            this.alertifyService.success(res.message!);
            this.updatedDomainValues = [];
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
