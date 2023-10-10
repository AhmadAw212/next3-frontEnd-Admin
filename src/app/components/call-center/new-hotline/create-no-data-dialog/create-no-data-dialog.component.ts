import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  }

  ngOnInit() {
    this.getDico();
    this.getNoDataTypeLovFindAll();
    this.createForm();
    this.myForm.patchValue(this.data.formData);
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      distributionNoDataBoolean: [false],
      distributionNoDataTypeId: { value: '', disabled: true },
      distributionNoDataUser: { value: '', disabled: true },
      distributionNoDataDate: { value: '', disabled: true },
      distributionNoDataPlateB: { value: '', disabled: true },
      distributionNoDataPlate: { value: '', disabled: true },
      distributionNoDataPolicy: { value: '', disabled: true },
      distributionNoDataEffDate: { value: '', disabled: true },
      distributionNoDataExpDate: { value: '', disabled: true },
      distributionNoDataName: { value: '', disabled: true },
      distributionNoDataCarBrand: { value: '', disabled: true },
      distributionNoDataBroker: { value: '', disabled: true },
      distributionNoDataRemarks: { value: '', disabled: true },
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

          this.myForm.get('distributionNoDataUser')?.setValue(this.displayName);
        }
      });
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
    // Check if the function has already been called
    if (!this.isGetNoDataTypeCalled) {
      this.isGetNoDataTypeCalled = true; // Set the flag to true to prevent further calls
      this.dataService.getNoDataTypeLovFindAll().subscribe({
        next: (data) => {
          this.noDataType = data.data;

          // Set the flag to true when data is successfully loaded
        },
        error: (err) => {
          console.log(err);

          // Reset the flag on error, allowing a retry if needed
          this.isGetNoDataTypeCalled = false;
        },
      });
    }
  }
  save() {
    this.dialogRef.close(this.myForm.value);
    // console.log(this.myForm.value);
  }
}
