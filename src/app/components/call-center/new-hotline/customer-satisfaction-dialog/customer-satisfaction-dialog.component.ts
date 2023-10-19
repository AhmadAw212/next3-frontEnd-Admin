import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
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
export class CustomerSatisfactionDialogComponent implements OnInit, OnDestroy {
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
  attitudeSubs!: Subscription;
  domainYNSubs!: Subscription;
  expertDelaySubs!: Subscription;
  notificationId?: string;
  type?: string;
  distributionTowArrivedDate?: Date;
  distributionTowDistDate?: any;
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
    this.initialiseData(data);
  }
  initialiseData(data: any) {
    this.domainYn = data.domainYn;
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
    this.notificationId = data?.notificationId;
    this.distributionTowArrivedDate = data?.distributionTowArrivedDate;
    this.distributionTowDistDate = data?.distributionTowDistDate;
    console.log(this.distributionTowDistDate);
    this.type = data.type;
    this.distributionLossArrivedDate = moment(
      data?.distributionLossArrivedDate,
      'DD/MM/yyyy hh:mm A'
    ).toDate();

    // data?.distributionLossArrivedDate,

    // console.log(this.distributionLossArrivedDate);
    this.formatDistributionLossDistDate = this.datePipe.transform(
      data.distributionLossDistDate,
      this.dateFormat('reportDateTimeFormat')
    );
    // console.log(data);
  }
  ngOnDestroy(): void {
    // if (this.attitudeSubs || this.domainYNSubs || this.expertDelaySubs) {
    //   this.attitudeSubs.unsubscribe();
    //   this.domainYNSubs.unsubscribe();
    //   this.expertDelaySubs.unsubscribe();
    // }
  }
  selectRow(index: number) {
    this.selectedRowIndex = index;
  }
  ngOnInit(): void {
    this.createForm();
    this.getDico();
    // this.getDomainYN();
    this.getExpertDelayReasonLovFindAll();
    this.getAttitudeLovFindAll();
  }
  disableLossDate(): boolean {
    const distributionLossDistDate = this.formatDistributionLossDistDate;
    const ccChangeExpDispDate = this.hasPerm('ccChangeExpDispDate');
    return distributionLossDistDate === null || !ccChangeExpDispDate;
    // return false;
  }
  private parseDate(dateString: string) {
    return moment(dateString, 'DD/MM/yyyy hh:mm A').toDate();
  }

  createForm() {
    // console.log(parsedDate);
    this.form = this.formBuilder.group({
      distributionLossDistDate: [
        {
          value: '',
          disabled: this.disableLossDate(),
        },
      ],
      dispatchFuArrivedId: [''],
      dispatchFuReasonId: [{ value: '', disabled: true }],
      dispatchFuArrivedDate: [{ value: '', disabled: true }],
      dispatchFuNote: [''],
      dispatchFuAttitude: [''],
      dispatchFuComplaints: [''],
      dispatchFuComplaint1: [{ value: null, disabled: true }],
      dispatchFuComplaint2: [{ value: null, disabled: true }],
      dispatchFuComplaint3: [{ value: null, disabled: true }],
      dispatchFuComplaint4: [{ value: null, disabled: true }],
      dispatchFuComplaint5: [{ value: null, disabled: true }],
      dispatchFuComplaintsNote: [''],
      dispatchFuNotification: [''],
      // distributionLossArrived: [null],
      dispatchFuType: [''],
    });
    // this.form.get('dispatchFuArrivedDate')?.valueChanges.subscribe((date) => {
    //   // console.log(date);
    // });
    this.onArrrivedFormChanges();
    this.onComplaintsChange();

    this.initializeDistibutionLossArrived();
  }

  private initializeDistibutionLossArrived(): void {
    if (this.type === 'ED') {
      this.form
        .get('distributionLossDistDate')
        ?.setValue(this.parseDate(this.formatDistributionLossDistDate));
    } else {
      this.form
        .get('distributionLossDistDate')
        ?.setValue(this.parseDate(this.distributionTowDistDate));
    }
    if (this.distributionLossArrivedBoolean) {
      this.form.get('dispatchFuArrivedId')?.setValue('Y');
      if (!this.distributionLossArrivedDate) {
        this.distributionLossArrivedDate = new Date();
      }
      if (this.type === 'ED') {
        this.form
          .get('dispatchFuArrivedDate')
          ?.setValue(this.distributionLossArrivedDate);
      } else {
        if (this.distributionTowArrivedDate) {
          this.form
            .get('distributionTowArrivedDate')
            ?.setValue(this.distributionTowArrivedDate);
        }
      }
      if (this.type === 'ED') {
        this.form.get('dispatchFuArrivedDate')?.disable();
      } else {
        this.form.get('dispatchFuArrivedDate')?.enable();
      }
      // console.log(date);
    } else {
      this.form.get('dispatchFuArrivedId')?.setValue('');
      this.form.get('dispatchFuArrivedDate')?.setValue(null);
    }
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
    const complaintsIdControl = this.form.get('dispatchFuComplaints');
    const complaintControls = [
      'dispatchFuComplaint1',
      'dispatchFuComplaint2',
      'dispatchFuComplaint3',
      'dispatchFuComplaint4',
      'dispatchFuComplaint5',
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

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getAttitudeLovFindAll() {
    this.attitudeSubs = this.dataService.getAttitudeLovFindAll().subscribe({
      next: (data) => {
        this.attidudeLov = data.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getDomainYN() {
    this.domainYNSubs = this.dataService.getDomainYN().subscribe({
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
    this.expertDelaySubs = this.dataService
      .getExpertDelayReasonLovFindAll()
      .subscribe({
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
      const descriptionDispatchFuArrivedCheck = this.form.get(
        'dispatchFuArrivedId'
      )?.value;
      const dispatchFuArrivedDate = this.form.get(
        'dispatchFuArrivedDate'
      )?.value;

      const date = this.datePipe.transform(
        dispatchFuArrivedDate,
        'yyyy-MM-ddTHH:mm:ss.SSS'
      );
      this.form.get('dispatchFuArrivedDate')?.enable();
      this.form.get('dispatchFuArrivedDate')?.setValue(date);
      this.form.get('disabledControl')?.disable();
      this.form.get('dispatchFuType')?.setValue('EXP');
      this.form.get('dispatchFuNotification')?.setValue(this.notificationId);
      // const userProfile = this.profileService.getUser();

      if (descriptionDispatchFuArrivedCheck === 'Y') {
        const lossDate = this.form.get('distributionLossDistDate')?.value;
        const dispatchFuArrivedDate = this.form.get(
          'dispatchFuArrivedDate'
        )?.value;

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
        if (!dispatchFuArrivedDate) {
          this.alertifyService.error('Kindly add arrived Date');
          return;
        }
        this.distributionLossArrivedBoolean = true;
        this.form.get('distributionLossArrived')?.setValue('Y');
      } else {
        this.distributionLossArrivedBoolean = false;
        this.distributionLossArrivedUser = '';
      }
      this.persistDispatchFollowUp();
    }
    this.dialogRef.close({
      customerSatis: this.form.value,
      distributionLossArrivedBoolean: this.distributionLossArrivedBoolean,
      distributionLossArrivedDate: this.distributionLossArrivedDate,
      distributionLossArrivedUser: this.distributionLossArrivedUser,
    });

    // console.log(this.form.value);
  }

  persistDispatchFollowUp() {
    this.dataService.persistDispatchFollowUp(this.form.value).subscribe({
      next: (res) => {
        this.alertifyService.dialogAlert(
          'Your Feedback has been saved successfully',
          res.title
        );
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
