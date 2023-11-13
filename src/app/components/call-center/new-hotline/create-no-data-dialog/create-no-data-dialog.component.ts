import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-create-no-data-dialog',
  templateUrl: './create-no-data-dialog.component.html',
  styleUrls: ['./create-no-data-dialog.component.css'],
})
export class CreateNoDataDialogComponent implements OnInit {
  dico?: any;
  noDataType?: type[] = [];
  myForm!: FormGroup;
  noDataValue?: boolean = false;
  displayName?: string;
  noDataTypeLoaded?: boolean = false;
  noDataSubscription?: Subscription;
  noDataTyp: boolean = false;
  private isGetNoDataTypeCalled = false;
  userCode?: string;
  distributionNoDataEffDate?: any;
  distributionNoDataExpDate?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CreateNoDataDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.displayName = data.displayname;
    this.userCode = data.userCode;
  }

  ngOnInit() {
    this.getDico();
    this.getNoDataTypeLovFindAll();
    this.createForm();
    this.myForm.patchValue(this.data.formData);
  }
  private formatDate(date: any): string {
    return this.isDateFormatted(date)
      ? date
      : this.dateFormat('reportDateTimeFormat');
  }
  private isDateFormatted(dateTime: any) {
    return (
      typeof dateTime === 'string' && this.dateFormat('reportDateTimeFormat')
    );
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      distributionNoDataBoolean: [
        { value: this.data.distributionNoDataBoolean, disabled: false },
      ],
      distributionNoDataTypeId: {
        value: this.data.distributionNoDataTypeId,
        disabled: true,
      },
      distributionNoDataUser: {
        value: this.data.distributionNoDataUser,
        disabled: true,
      },
      distributionNoDataDate: {
        value: this.data.distributionNoDataDate
          ? this.formatDate(this.data.distributionNoDataDate)
          : '',

        disabled: true,
      },
      distributionNoDataPlateB: {
        value: this.data.distributionNoDataPlateB,
        disabled: true,
      },
      distributionNoDataPlate: {
        value: this.data.distributionNoDataPlate,
        disabled: true,
      },
      distributionNoDataPolicy: {
        value: this.data.distributionNoDataPolicy,
        disabled: true,
      },
      distributionNoDataEffDate: {
        value: this.data.distributionNoDataEffDate
          ? this.formatDate(this.data.distributionNoDataEffDate)
          : '',
        disabled: true,
      },
      distributionNoDataExpDate: {
        value: this.data.distributionNoDataExpDate
          ? this.formatDate(this.data.distributionNoDataExpDate)
          : '',
        disabled: true,
      },
      distributionNoDataName: {
        value: this.data.distributionNoDataName,
        disabled: true,
      },
      distributionNoDataCarBrand: {
        value: this.data.distributionNoDataCarBrand,
        disabled: true,
      },
      distributionNoDataBroker: {
        value: this.data.distributionNoDataBroker,
        disabled: true,
      },
      distributionNoDataRemarks: {
        value: this.data.distributionNoDataRemarks,
        disabled: true,
      },
    });

    const formControlsToEnable = [
      'distributionNoDataTypeId',
      'distributionNoDataPlateB',
      'distributionNoDataPlate',
      'distributionNoDataPolicy',
      'distributionNoDataEffDate',
      'distributionNoDataExpDate',
      'distributionNoDataName',
      'distributionNoDataCarBrand',
      'distributionNoDataBroker',
      'distributionNoDataRemarks',
    ];
    const noDataBoolean = this.myForm.get('distributionNoDataBoolean');
    if (noDataBoolean?.value) {
      this.myForm.enable();
    } else {
      this.myForm.disable();
    }
    this.myForm
      .get('distributionNoDataBoolean')
      ?.valueChanges.subscribe((noDataValue) => {
        for (const controlName of formControlsToEnable) {
          const control = this.myForm.get(controlName);
          if (control) {
            if (noDataValue) {
              control.enable();
            } else {
              control.disable();
            }
          }
        }
        if (noDataValue) {
          const formattedDate = this.datePipe.transform(
            new Date(),
            this.dateFormat('reportDateTimeFormat')
          ); // Change the format as needed
          this.myForm.get('distributionNoDataDate')?.setValue(formattedDate);

          this.myForm.get('distributionNoDataUser')?.setValue(this.userCode);
        }
      });

    this.myForm.get('distributionNoDataBoolean')?.enable();
    this.myForm.get('distributionNoDataUser')?.disable();
    this.myForm.get('distributionNoDataDate')?.disable();
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getNoDataTypeLovFindAll() {
    if (!this.isGetNoDataTypeCalled) {
      this.dataService.getNoDataTypeLovFindAll().subscribe({
        next: (data) => {
          this.noDataType = data.data;
          this.isGetNoDataTypeCalled = true;
        },
        error: (err) => {
          console.log(err);
          this.isGetNoDataTypeCalled = false;
        },
      });
    }
  }
  changeDateFormat(event: any) {
    const date = this.datePipe.transform(
      event,
      this.dateFormat('reportDateTimeFormat')
    );
    this.distributionNoDataEffDate = date;
    // this.myForm.get('distributionNoDataEffDate')?.setValue(date);

    // const date2 = this.myForm.get('distributionNoDataEffDate')?.value;
    // console.log(date2);
  }
  changeDateFormat2(event: any) {
    const date = this.datePipe.transform(
      event,
      this.dateFormat('reportDateTimeFormat')
    );
    this.distributionNoDataExpDate = date;
    // this.myForm.get('distributionNoDataEffDate')?.setValue(date);
  }
  save() {
    const rawValue = {
      ...this.myForm.getRawValue(),
      distributionNoDataUser: this.userCode,
      distributionNoDataEffDate: this.distributionNoDataEffDate,
      distributionNoDataExpDate: this.distributionNoDataExpDate,
    };
    console.log(rawValue);
    this.dialogRef.close(rawValue);
    // console.log(this.myForm.value);
  }
}
