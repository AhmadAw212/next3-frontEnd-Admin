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
export class CreateNoDataDialogComponent implements OnInit, OnDestroy {
  dico?: any;
  noDataType?: type[] = [];
  myForm!: FormGroup;
  noDataValue?: boolean = false;
  displayName?: string;
  noDataTypeLoaded?: boolean = false;
  noDataSubscription?: Subscription;
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
  ) {}
  ngOnDestroy(): void {
    if (this.noDataSubscription) {
      this.noDataSubscription.unsubscribe();
    }
  }
  async getData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Call your service here to fetch data
      this.profileService.loginInfo$.subscribe({
        next: (data: any) => {
          const displayName = data?.displayName;
          this.displayName = displayName;
          if (displayName) {
            this.myForm.get('noData')?.enable();
          } else {
            this.myForm.get('noData')?.disable();
          }
          resolve(); // Resolve the promise when the data is successfully fetched
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          reject(error); // Reject the promise if there is an error during the service call
        },
      });
    });
  }
  async ngOnInit(): Promise<void> {
    try {
      this.createForm();
      await this.getData();
      if (this.data) {
        this.myForm.patchValue(this.data.formData);
      }
      this.getDico();
      this.getNoDataTypeLovFindAll();
    } catch (err) {
      console.log(err);
    }
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      noData: [false],
      type: { value: '', disabled: true },
      user: { value: '', disabled: true },
      date: { value: '', disabled: true },
      plateChar: { value: '', disabled: true },
      plate: { value: '', disabled: true },
      policy: { value: '', disabled: true },
      effDate: { value: '', disabled: true },
      expDate: { value: '', disabled: true },
      name: { value: '', disabled: true },
      carMake: { value: '', disabled: true },
      broker: { value: '', disabled: true },
      note: { value: '', disabled: true },
    });

    const formControlsToEnable = [
      'type',
      'user',
      'date',
      'plateChar',
      'plate',
      'policy',
      'effDate',
      'expDate',
      'name',
      'carMake',
      'broker',
      'note',
    ];

    this.myForm.get('noData')?.valueChanges.subscribe((noDataValue) => {
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
        this.myForm.get('date')?.setValue(formattedDate);

        this.myForm.get('user')?.setValue(this.displayName);
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

    this.noDataSubscription = this.dataService
      .getNoDataTypeLovFindAll()
      .subscribe({
        next: (data) => {
          this.noDataType = data.data;
          // Set the flag to true when data is successfully loaded
        },
        error: (err) => {
          console.log(err);
          this.noDataTypeLoaded = false; // Reset the flag on error, allowing a retry if needed
        },
      });
  }
  save() {
    this.dialogRef.close(this.myForm.value);
  }
}
