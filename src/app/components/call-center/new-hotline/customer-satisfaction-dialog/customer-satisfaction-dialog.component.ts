import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-customer-satisfaction-dialog',
  templateUrl: './customer-satisfaction-dialog.component.html',
  styleUrls: ['./customer-satisfaction-dialog.component.css'],
})
export class CustomerSatisfactionDialogComponent {
  dico?: any;
  ratingValue: number = 0;
  carPlate?: string;
  brandDesc?: string;
  notificationContactName?: string;
  notificationContactPhone?: string;
  towFromTownDescription?: string;
  towToTownDescription?: string;
  towingComDesc?: string;
  notificationMatDamageDesc?: string;
  // distributionLossDistDate?: string;
  // dispatchFuArrivedDate?: string;
  domainYn: type[] = [];
  expertDelayReason: type[] = [];
  carsDispatchFollowUpList: any;
  form!: FormGroup;
  attidudeLov: type[] = [];
  selectedRowIndex: number = 0;
  distributionLossArrivedBoolean?: boolean;
  distributionLossArrivedDate?: any;
  custFollowUp?: string;
  formatDistributionLossDistDate?: any;
  distributionLossArrivedUser?: string;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CustomerSatisfactionDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.carPlate = data?.carPlate;
    this.brandDesc = data?.brandDescription;
    this.notificationContactName = data?.notificationContactName;
    this.notificationContactPhone = data?.notificationContactPhone;
    this.towFromTownDescription = data?.towFromTownDescription;
    this.towToTownDescription = data?.towToTownDescription;
    this.towingComDesc = data?.towingComDesc;
    this.notificationMatDamageDesc = data?.notificationMatDamageDesc;
    this.carsDispatchFollowUpList = data?.carsDispatchFollowUpList;
    this.distributionLossArrivedBoolean = data?.distributionLossArrivedBoolean;
    this.distributionLossArrivedDate = data?.distributionLossArrivedDate;
    // console.log(this.distributionLossArrivedDate);
    this.formatDistributionLossDistDate = this.datePipe.transform(
      data.distributionLossDistDate,
      this.dateFormat('reportDateTimeFormat')
    );
  }
  selectRow(index: number) {
    this.selectedRowIndex = index;
  }
  ngOnInit(): void {
    this.createForm();
    this.getDico();
    this.getDomainYN();
    this.getExpertDelayReasonLovFindAll();
    this.getAttitudeLovFindAll();
  }
  disableLossDate(): boolean {
    const distributionLossDistDate = this.formatDistributionLossDistDate;
    const ccChangeExpDispDate = this.hasPerm('ccChangeExpDispDate');
    // return distributionLossDistDate === null || !ccChangeExpDispDate;
    return false;
  }
  createForm() {
    const parsedDate = moment(
      this.formatDistributionLossDistDate,
      'DD/MM/yyyy hh:mm A'
    ).toDate();
    console.log(parsedDate);
    this.form = this.formBuilder.group({
      distributionLossDistDate: [
        {
          value: parsedDate,
          disabled: this.disableLossDate(),
        },
      ],
      dispatchFuArrivedId: [''],
      dispatchFuReasonId: [{ value: '', disabled: true }],
      dispatchFuArrivedDate: [{ value: '', disabled: true }],
      dispatchFuNote: [''],
      dispatchFuAttitudeId: [''],
      dispatchFuComplaintsId: [''],
      dispatchFuComplaint1Boolean: [{ value: null, disabled: true }],
      dispatchFuComplaint2Boolean: [{ value: null, disabled: true }],
      dispatchFuComplaint3Boolean: [{ value: null, disabled: true }],
      dispatchFuComplaint4Boolean: [{ value: null, disabled: true }],
      dispatchFuComplaint5Boolean: [{ value: null, disabled: true }],
      dispatchFuComplaintsNote: [''],
      dispatchFuComplaint1: [null],
      dispatchFuComplaint2: [null],
      dispatchFuComplaint3: [null],
      dispatchFuComplaint4: [null],
      dispatchFuComplaint5: [null],
    });
    // console.log(this.disableLossDate());

    if (this.distributionLossArrivedBoolean) {
      this.form.get('dispatchFuArrivedId')?.setValue('Y');
      if (!this.distributionLossArrivedDate) {
        this.distributionLossArrivedDate = new Date();
      }
      this.form
        .get('dispatchFuArrivedDate')
        ?.setValue(this.distributionLossArrivedDate);
    } else {
      this.form.get('dispatchFuArrivedId')?.setValue('');
      this.form.get('dispatchFuArrivedDate')?.setValue(null);
    }

    this.onArrrivedFormChanges();
    this.onComplaintsChange();
    this.expertCheckBoxChangeListener();
    this.towTruckChangeListener();
    this.repairShopChangeListener();
    this.pudChangeListener();
    this.callcenterChangeListener();
  }
  private onArrrivedFormChanges() {
    this.form.get('dispatchFuArrivedId')?.valueChanges.subscribe((data) => {
      if (data === 'N') {
        this.form.get('dispatchFuReasonId')?.enable();
        this.form.get('dispatchFuArrivedDate')?.disable();
        this.form.get('dispatchFuArrivedDate')?.setValue('');
      } else {
        if (data === 'Y') {
          this.form.get('dispatchFuReasonId')?.disable();
          this.form.get('dispatchFuArrivedDate')?.enable();
          this.form.get('dispatchFuArrivedDate')?.setValue(new Date());
        }
      }
    });
  }
  private onComplaintsChange() {
    const complaintsIdControl = this.form.get('dispatchFuComplaintsId');
    const complaintControls = [
      'dispatchFuComplaint1Boolean',
      'dispatchFuComplaint2Boolean',
      'dispatchFuComplaint3Boolean',
      'dispatchFuComplaint4Boolean',
      'dispatchFuComplaint5Boolean',
    ].map((controlName) => this.form.get(controlName));

    complaintsIdControl?.valueChanges.subscribe((data) => {
      if (data === 'N') {
        complaintControls.forEach((control) => {
          control?.disable();
          control?.setValue(null);
        });
      } else if (data === 'Y') {
        complaintControls.forEach((control) => control?.enable());
      }
    });
  }
  expertCheckBoxChangeListener() {
    this.form
      .get('dispatchFuComplaint1Boolean')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('dispatchFuComplaint1')?.setValue('Y');
        } else {
          this.form.get('dispatchFuComplaint1')?.setValue('N');
        }
      });
  }
  towTruckChangeListener() {
    this.form
      .get('dispatchFuComplaint2Boolean')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('dispatchFuComplaint2')?.setValue('Y');
        } else {
          this.form.get('dispatchFuComplaint2')?.setValue('N');
        }
      });
  }
  repairShopChangeListener() {
    this.form
      .get('dispatchFuComplaint3Boolean')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('dispatchFuComplaint3')?.setValue('Y');
        } else {
          this.form.get('dispatchFuComplaint3')?.setValue('N');
        }
      });
  }
  pudChangeListener() {
    this.form
      .get('dispatchFuComplaint4Boolean')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('dispatchFuComplaint4')?.setValue('Y');
        } else {
          this.form.get('dispatchFuComplaint4')?.setValue('N');
        }
      });
  }
  callcenterChangeListener() {
    this.form
      .get('dispatchFuComplaint5Boolean')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('dispatchFuComplaint5')?.setValue('Y');
        } else {
          this.form.get('dispatchFuComplaint5')?.setValue('N');
        }
      });
  }
  save() {}
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
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
  getAttitudeLovFindAll() {
    this.dataService.getAttitudeLovFindAll().subscribe({
      next: (data) => {
        this.attidudeLov = data.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getDomainYN() {
    this.dataService.getDomainYN().subscribe({
      next: (data) => {
        this.domainYn = data.data.filter((item: any) => item.code !== 'ALL');
        // console.log(this.domainYn);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getExpertDelayReasonLovFindAll() {
    this.dataService.getExpertDelayReasonLovFindAll().subscribe({
      next: (res) => {
        this.expertDelayReason = res.data;
        // console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  dialogCustomerSatisfactionListener() {
    if (this.form.value) {
      this.custFollowUp = 'Y';
      const parsedDate = moment(
        this.formatDistributionLossDistDate,
        'DD/MM/yyyy hh:mm A'
      ).toDate();
      const descriptionDispatchFuArrivedCheck = this.form.get(
        'dispatchFuArrivedId'
      )?.value;
      if (descriptionDispatchFuArrivedCheck === 'Y') {
        const lossDate = this.form.get('distributionLossDistDate')?.value;
        const dispatchFuArrivedDate = this.form.get(
          'dispatchFuArrivedDate'
        )?.value;
        // console.log(dispatchFuArrivedDate);
        // console.log(lossDate);
        // const date = new Date(dispatchFuArrivedDate);

        if (!lossDate && dispatchFuArrivedDate) {
          this.distributionLossArrivedBoolean = false;
          this.distributionLossArrivedDate = null;
          this.distributionLossArrivedUser = '';
          this.alertifyService.error(
            'Kindly Dispatch Expert Before Selecting Arrived'
          );
          return;
        }
        if (dispatchFuArrivedDate < lossDate) {
          this.alertifyService.error(
            'Expert Arrived date is before dispatch date'
          );
          return;
        }
      }
    }
    this.dialogRef.close({
      customerSatis: this.form.value,
      distributionLossArrivedBoolean: this.distributionLossArrivedBoolean,
      distributionLossArrivedDate: this.distributionLossArrivedDate,
      distributionLossArrivedUser: this.distributionLossArrivedUser,
    });

    // console.log(this.distributionLossArrivedDate);
  }
}
