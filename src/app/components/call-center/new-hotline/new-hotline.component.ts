import { DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from 'ngx-editor';
import { Policy } from 'src/app/model/policy';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { CreateNoDataDialogComponent } from './create-no-data-dialog/create-no-data-dialog.component';
import { ChangeToAvailableDataComponent } from './change-to-available-data/change-to-available-data.component';
import { AppExpertDispatchDialogComponent } from './app-expert-dispatch-dialog/app-expert-dispatch-dialog.component';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { ChooseManuallyComponent } from './choose-manually/choose-manually.component';
import { AddBodilyInjuryDialogComponent } from './add-bodily-injury-dialog/add-bodily-injury-dialog.component';
import { SecondExpertDialogComponent } from './second-expert-dialog/second-expert-dialog.component';
import { CustomerSatisfactionDialogComponent } from './customer-satisfaction-dialog/customer-satisfaction-dialog.component';
import { RotationDialogComponent } from './rotation-dialog/rotation-dialog.component';
import { ExpertDispatchComponent } from './expert-dispatch/expert-dispatch.component';
import * as moment from 'moment';
import { Subscription, lastValueFrom } from 'rxjs';
import { TowingConditionComponent } from '../towing-condition/towing-condition.component';
import { TowingConditionsHotlineComponent } from './towing-conditions-hotline/towing-conditions-hotline.component';
import { RepairShopDialogComponent } from './repair-shop-dialog/repair-shop-dialog.component';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';
import { ClaimsDialogComponent } from './claims-dialog/claims-dialog.component';
import { TowCasesDialogComponent } from './tow-cases-dialog/tow-cases-dialog.component';

@Component({
  selector: 'app-new-hotline',
  templateUrl: './new-hotline.component.html',
  styleUrls: ['./new-hotline.component.css'],
})
export class NewHotlineComponent implements OnInit, OnDestroy {
  dico?: any;
  notificationId!: string;
  policyData?: Policy;
  reportedByData: type[] = [];
  relationToOwnerData: type[] = [];
  natureLov: type[] = [];
  form!: FormGroup;
  polserno?: string;
  eReportedBy: type[] = [];
  ccBrokerValid?: string;
  policyInfoTypeShow?: string;
  ccRepFlag?: string;
  ccTowFlag?: string;
  [key: string]: any;
  formData?: any;
  changeAvailableData?: any;
  telExtension?: string;
  showTelIcon?: string;
  ccRotationManual?: string;
  carRespReasonCodeValues?: type[] = [];
  ExpCancelReas?: type[] = [];
  policySearchData?: any;
  searchTimer?: any;
  territoryValues?: type[] = [];
  companies: CompanyBranchList[] = [];
  loginInfo?: any;
  displayName?: string;
  bodilyInjury?: string;
  severity?: string;
  expertDispatchType: type[] = [];
  addressCode?: type;
  profile?: any;
  supplierExperts?: any;
  showrelated?: string;
  selectedRowIndex: number = 0;
  towNatureLov: type[] = [];
  supplierGarageLov: any[] = [];
  domainYn: type[] = [];
  towCancelReason: type[] = [];
  towDelayReasonLov: type[] = [];
  @ViewChild('suggestTowCompany') suggestTowCompany!: TemplateRef<any>;
  @ViewChild('towConditions') towConditions!: TemplateRef<any>;
  // @ViewChild('customerSatisfaction') customerSatisfaction!: TemplateRef<any>;
  @ViewChild('towingConditions') towingConditions!: TemplateRef<any>;
  coverByCar?: type;
  selectedTowingCmp?: any;
  coverSubscription?: Subscription;
  towingAlertRen?: string;
  towingCondAccAndMec?: any[];
  getCover: boolean = false;
  private dialogRef!: MatDialogRef<any>;
  carsDispatchFollowUpList?: any;
  expertDelayReason?: any[];
  attidudeLov?: any[];
  form2!: FormGroup;
  lossCarId?: string;

  constructor(
    private dataService: DataServiceService,
    private fb: FormBuilder,
    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private profileService: LoadingServiceService, // private dialogRef: MatDialogRef<TowingConditionComponent>,
    private router: Router
  ) {}
  ngOnDestroy(): void {}
  openTowingConditionList() {
    const dialofRef = this.dialog.open(TowingConditionsHotlineComponent, {
      data: { towingConditions: this.policyData?.towingCompanyList },
      width: '1500px',
      height: '800px',
    });
  }
  selectRow(index: number) {
    this.selectedRowIndex = index;
  }
  openTowConditions() {
    if (this.policyData) {
      this.dialogRef = this.dialog.open(this.towConditions, {
        width: '800px',
        height: '200px',
        data: {
          /* You can pass data to the dialog here */
        },
      });
    }
  }
  openClaimsDialog() {
    if (this.policyData) {
      const dialogRef = this.dialog.open(ClaimsDialogComponent, {
        data: {},
        width: '1500px',
        height: '500px',
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.policyData = data;
          this.form.patchValue(data);
          this.patchFormWithPolicyData();
        }
      });
    }
  }
  openTowingDispDialog() {
    if (this.policyData) {
      const dialogRef = this.dialog.open(TowCasesDialogComponent, {
        data: {},
        width: '1500px',
        height: '500px',
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.policyData = data;
          this.form.patchValue(data);
          this.patchFormWithPolicyData();
        }
      });
    }
  }

  openRepairShopeDialog() {
    if (this.policyData) {
      this.dialogRef = this.dialog.open(RepairShopDialogComponent, {
        width: '1100px',
        height: '730px',
        data: {
          telExtension: this.telExtension,
          showTelIcon: this.showTelIcon,
          notificationStatusCode: this.policyData?.notificationStatusCode,
        },
      });
      this.dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.form.get('lossTowRsId')?.setValue(data.supplierId);
          this.form.get('lossTowRsDesc')?.setValue(data.supplierName);
        }
      });
    }
  }
  // openCustomerSatisfaction() {
  //   if (this.policyData) {
  //     const dialogRef = this.dialog.open(this.customerSatisfaction, {
  //       width: '2000px',
  //       height: '700px',
  //       data: {
  //         /* You can pass data to the dialog here */
  //       },
  //     });
  //     // dialogRef.afterOpened().subscribe(() => {
  //     //   // this.initializeDistibutionLossArrived();
  //     //   // this.onArrrivedFormChanges();
  //     //   // this.onComplaintsChange();
  //     //   // this.expertCheckBoxChangeListener();
  //     //   // this.towTruckChangeListener();
  //     //   // this.repairShopChangeListener();
  //     //   // this.pudChangeListener();
  //     //   // this.callcenterChangeListener();
  //     //   // this.getExpertDelayReasonLovFindAll();
  //     //   // this.getAttitudeLovFindAll();
  //     //   // const date = this.form.get('distributionLossDistDate')?.value;
  //     //   // this.formatDateTime(date);
  //     //   // this.form.get('dispatchFuReasonId')?.setValue('');
  //     //   // this.form.get('dispatchFuNote')?.setValue('');
  //     //   // this.form.get('dispatchFuAttitude')?.setValue('');
  //     //   // this.form.get('dispatchFuComplaintsId')?.setValue('');
  //     //   // this.form.get('dispatchFuComplaintsNote')?.setValue('');
  //     //   // const distributionTowArrivedDate = this.form.get(
  //     //   //   'distributionTowArrivedDate'
  //     //   // );
  //     //   // if (!distributionTowArrivedDate?.value) {
  //     //   //   distributionTowArrivedDate?.setValue(new Date());
  //     //   // }
  //     //   // console.log(date);
  //     // });
  //   }
  // }
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

  openSuggestDialog(): void {
    if (this.policyData) {
      this.dialogRef = this.dialog.open(this.suggestTowCompany, {
        width: '500px',
        height: '500px',
        data: {
          /* You can pass data to the dialog here */
        },
      });
      this.dialogRef.afterOpened().subscribe(async () => {
        await this.getCoverByCarId();
        await this.selectRowTowingCompany(
          this.selectedRowIndex,
          this.policyData?.towingCompanyList![0]
        );
      });
    }

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('Dialog result:', result);
    // });
  }

  // addCarDispatchFollowUp() {
  //   this.form2 = this.fb.group({
  //     dispatchFuArrivedId: [''],
  //     dispatchFuReasonId: [{ value: '', disabled: true }],
  //     dispatchFuArrivedDate: [{ value: '', disabled: true }],
  //     dispatchFuNote: [''],
  //     dispatchFuAttitude: [''],
  //     dispatchFuComplaintsId: [''],
  //     dispatchFuComplaint1Boolean: [{ value: null, disabled: true }],
  //     dispatchFuComplaint2Boolean: [{ value: null, disabled: true }],
  //     dispatchFuComplaint3Boolean: [{ value: null, disabled: true }],
  //     dispatchFuComplaint4Boolean: [{ value: null, disabled: true }],
  //     dispatchFuComplaint5Boolean: [{ value: null, disabled: true }],
  //     dispatchFuComplaintsNote: [''],
  //     dispatchFuNotification: [''],
  //     dispatchFuType: [''],
  //     // distributionLossDistDate: [null],
  //   });
  // }

  getCoverByCarId() {
    if (!this.getCover) {
      const carId = this.policyData?.carId;
      if (carId != null) {
        this.coverSubscription = this.dataService
          .getCoverByCarId(carId)
          .subscribe({
            next: (res) => {
              this.coverByCar = res.data[0];
              this.getCover = true;
              // console.log(res);
            },
            error: (err) => {
              this.getCover = false;
              console.log(err);
            },
          });
      }
    }
  }
  async ngOnInit(): Promise<void> {
    this.visaForm();
    await this.getData();
    this.getDico();
    this.route.params.subscribe((params) => {
      this.notificationId = params['notificationId'];

      this.getPolicyCarByNotificationId(this.notificationId);
      this.userRolesService.getUserRoles();
      this.getCompaniesPerUser();

      this.getReportedByLovFindAll();
      this.getRelationToOwnerLovFindAll();
      this.getNotificationNatureLovFindAll();
      this.getEReportedByLovFindAll();

      this.carRespReasonCode();

      this.getExpCancelReasonLovFindAll();
      this.getExpertDispatchTypeLovFindAll();
      this.profile = this.profileService.getSelectedProfile();
      this.getTowingNatureLovFindAll();
      this.getDomainYN();
      this.getTowCancelReasonLovFindAll();
      this.getTowDelayReasonLovFindAll();
      this.getSupplierGarageLov();
    });
  }
  private parseDate(dateString: string): Date {
    return moment(dateString, 'DD/MM/yyyy hh:mm A').toDate();
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
  visaForm() {
    this.form = this.fb.group({
      lossTowLossDate: ['', Validators.required],
      notificationReportedDate: [null, Validators.required],
      lossTowReportedById: ['', Validators.required],
      notificationContactName: [''],
      lossTowDriverRelationshipId: [''],
      lossTowDriverName: [''],
      notificationContactPhone: [''],
      lossTowNbrVehInvolved: [''],
      lossTowEreportedById: [''],
      notificationMatDamageId: [''],
      sysCreatedBy: [''],
      carSelfSurveyUrl: [''],
      lossTowExpertNamePreference: [''],
      carRespReasonCode: [''],
      distributionExpCanceledId: [''],
      distributionTownName: [''],
      distributionTownDescription: [''],
      supplierName: [''],
      distributionExpCanceledUser: [''],
      distributionExpCanceledDate: [null],
      lossTowSeverity: [''],
      lossTowBodilyCaseId: [''],
      distributionExpTypeId: [''],
      lossTow2ndExpertId: [''],
      distributionLossDistributionBoolean: [''],
      // distributionLossDistDate: [null],
      distributionLossDistUser: [''],
      distributionLossArrivedBoolean: [false],
      distributionLossArrivedDate: [null],
      distributionLossArrivedUser: [''],
      expertMobilePhone: [''],
      distributionTownId: [''],
      distributionExpExpertId: [''],
      distributionExpTypeDate: [null],
      distributionExpTypeUser: [''],
      // distributionTownNameBind: [''],
      distributionTown: [''],
      // towFromTown : [''],
      fromTowTownName: [''],
      delayedDispatchTime: [''],
      lossTowExpertId: [''],
      lossTowExpertMan: [''],
      lossTowExpertRot: [''],
      distributionTema: [''],
      distributionLossDistribution: [''],
      distributionLossArrived: [''],
      lossTowExpertNamePreferenceById: [''],
      lossTowExpert: [''],
      // carsDispatchFollowUp: this.fb.array([]),
      distributionTowNatureId: [''],
      lossTowRsDesc: [''],
      towToTownName: [''],
      // towToTownNameDesc: [''],
      towFromTownDescription: [''],
      towFromTownId: [''],
      towToTownDescription: [''],
      towToTownId: [''],
      distributionTowDistDateBoolean: [''],
      distributionTowDistDate: [''],
      distributionTowArrivedUser: [''],
      delayedTowingTime: [''],
      distributionTowArrivedDateBoolean: [''],
      distributionTowArrivedDate: [''],
      distributionTowDriverName: [''],
      distributionTowDriverPhone: [''],
      distributionTowCanceledId: [''],
      distributionTowDelayId: [''],
      distributionTowDelayOther: [''],
      distributionTowDistLifterId: [''],
      distributionTowTotalKm: [''],
      distributionTowExtraKm: [''],
      distributionTowClientCost: [''],
      distributionTowTotalCost: [''],
      totaleDurationBetweenTown: [''],
      lossTowBlockedId: [''],
      lossTowWheelId: [''],
      lossTowPickUpId: [''],
      lossTowOffRoadId: [''],
      lossTowCarryingGoodId: [''],
      lossTowLifterId: [''],
      towingComDesc: [''],
      distributionLossDistDate: [null],
      towingComId: [''],
      lossTowRsId: [''],
      distributionExpExpertDesc: [''],
      // lossTowRsName: [''],
    });
  }
  // addCarDispatchFollowUp() {}

  disableLossDate(): boolean {
    const distributionLossDistDate = this.form.get(
      'distributionLossDistDate'
    )?.value;
    const ccChangeExpDispDate = this.hasPerm('ccChangeExpDispDate');
    return distributionLossDistDate === null || !ccChangeExpDispDate;
    // return false;
  }
  async getData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Call your service here to fetch data
      this.profileService.loginInfo$.subscribe({
        next: (data: any) => {
          const displayName = data?.displayName;
          this.displayName = displayName;
          this.loginInfo = data;
          // console.log(this.loginInfo);
          if (displayName) {
            this.form.get('distributionExpCanceledId')?.enable();
          } else {
            this.form.get('distributionExpCanceledId')?.disable();
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
  getTowDelayReasonLovFindAll() {
    this.dataService.getTowDelayReasonLovFindAll().subscribe({
      next: (data) => {
        this.towDelayReasonLov = data.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  noExpert() {
    if (this.policyData) {
      const controlsToReset = [
        'delayedDispatchTime',
        'distributionExpTypeId',
        'distributionExpExpertId',
        'distributionExpExpertDesc',
        'lossTowExpertNamePreference',
        'distributionExpTypeUser',
        'distributionExpTypeDate',
        'distributionLossDistDate',
        'distributionLossDistUser',
        'lossTowExpertId',
        'distributionLossDistributionBoolean',
        'lossTowNeedExpertReportBoolean',
        'expertMobilePhone',
        'distributionLossArrivedBoolean',
        'distributionLossArrivedDate',
        'distributionLossArrivedUser',
      ];

      controlsToReset.forEach((controlName) => {
        this.form.get(controlName)?.setValue(null);
      });

      this.form.get('lossTowNeedExpertReportBoolean')?.setValue('6');
      this.form.get('distributionLossDistributionBoolean')?.setValue(false);
      this.form.get('distributionLossArrivedBoolean')?.setValue(false);
    }
  }

  dispatchFuArrivedTowingChangeListener() {
    const distributionTowArrivedDateBoolean = this.form.get(
      'distributionTowArrivedDateBoolean'
    )?.value;

    if (distributionTowArrivedDateBoolean) {
      const distributionTowArrivedDate = this.form.get(
        'distributionTowArrivedDate'
      );
      // console.log(distributionTowArrivedDate?.value);
      if (!distributionTowArrivedDate?.value) {
        distributionTowArrivedDate?.setValue(new Date());
      }

      this.customerSatisfactionDialog('TD');
    } else {
      this.form.get('distributionTowArrivedDate')?.setValue(null);
      this.form.get('distributionTowArrivedUser')?.setValue(null);
    }
  }
  lossTowExpertNameValueChangeListener(event: any) {
    const lossTowExpertName = this.form.get(
      'lossTowExpertNamePreference'
    )?.value;
    // const lossTowExpertId = this.form
    //   .get('lossTowExpertNamePreferenceId')
    //   ?.setValue(event);

    this.form.get('lossTowExpertId')?.setValue(event);
    this.form.get('lossTowExpertNamePreferenceById')?.setValue(event);

    // if (lossTowExpertId) {
    //   this.getSupplierFindById(event);
    // } else {
    if (!lossTowExpertName) {
      this.form.get('lossTowExpertId')?.setValue('');
      this.form.get('lossTowExpertNamePreferenceById')?.setValue('');
      this.form.get('distributionExpExpertId')?.setValue('');
      this.form.get('distributionExpExpertDesc')?.setValue('');
      this.form.get('distributionLossDistributionBoolean')?.setValue(false);
      this.form.get('distributionLossDistDate')?.setValue('');
      this.form.get('distributionLossDistUser')?.setValue('');
      this.form.get('distributionLossArrivedBoolean')?.setValue(false);
      this.form.get('distributionLossArrivedDate')?.setValue(null);
      this.form.get('distributionLossArrivedUser')?.setValue('');
      this.form.get('distributionExpTypeId')?.setValue('');
      this.form.get('distributionExpTypeDate')?.setValue('');
      this.form.get('distributionExpTypeUser')?.setValue('');
      this.form.get('expertMobilePhone')?.setValue('');
    }

    // console.log(lossTowExpertId);
    // }
  }
  getExpertBySupplierNamePreference(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataService.getExpertBySupplierNamePreference(event.term).subscribe({
        next: (res) => {
          this.supplierExperts = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 300);
  }
  onSubmit() {
    // Enable disabled form controls temporarily
    const disabledControls = [
      'distributionExpCanceledUser',
      'distributionExpCanceledDate',
      'distributionLossDistributionBoolean',
      'distributionLossDistDate',
      'distributionLossDistUser',
      'distributionLossArrivedDate',
      'distributionLossArrivedUser',
      'distributionExpTypeId',
      'expertMobilePhone',
      'distributionExpExpertDesc',
      'distributionExpTypeDate',
      'distributionExpTypeUser',
      'delayedDispatchTime',
      'distributionTema',
      'supplierName',
      'lossTowRsDesc',
      'distributionTowDistDateBoolean',
      'distributionTowDistDate',
      'distributionTowArrivedUser',
      'delayedTowingTime',
      'distributionTowArrivedDate',
      'distributionTowTotalKm',
      'distributionTowExtraKm',
      'distributionTowClientCost',
      'totaleDurationBetweenTown',
      // 'towingComDesc',
      // Add other control names as needed
    ];

    disabledControls.forEach((controlName) => {
      this.form.get(controlName)?.enable();
      // this.form.get('supplierName')?.disable();
      // this.form.get('fromTowTownName')?.disable();
      // this.form.get('distributionTownName')?.disable();
      // this.form.get('distributionExpExpertDesc')?.disable();
      // this.form.get('lossTowExpertNamePreference')?.disable();
      // this.form.get('delayedDispatchTime')?.disable();
      // this.form.get('towToTownName')?.disable();
    });

    // Log the form value
    console.log(this.form.value);

    // Disable the form controls again
    disabledControls.forEach((controlName) => {
      this.form.get(controlName)?.disable();
      // this.form.get('supplierName')?.enable();
      // this.form.get('fromTowTownName')?.enable();
      // this.form.get('distributionTownName')?.enable();
      // this.form.get('distributionExpExpertDesc')?.enable();
      // this.form.get('lossTowExpertNamePreference')?.enable();
      // this.form.get('delayedDispatchTime')?.enable();
      // this.form.get('towToTownName')?.enable();
    });
  }
  configList() {
    const codesToFind = [
      'polserno',
      'ccBrokerValid',
      'policyInfoTypeShow',
      'ccRepFlag',
      'ccTowFlag',
      'telExtension',
      'showTelIcon',
      'ccRotationManual',
    ];

    codesToFind.forEach((code) => {
      const configItem = this.policyData?.configList?.find(
        (config) => config.code === code
      );
      if (configItem) {
        this[code] = configItem.description;
        // console.log(this.ccRotationManual);
        // console.log(`${code}: ${this[code]}`);
      } else {
        console.log(`${code} not found`);
      }
    });
  }
  onCancelExpReasonChange() {
    const distributionExpCanceledUserControl = this.form.get(
      'distributionExpCanceledUser'
    );
    const distributionExpCanceledDateControl = this.form.get(
      'distributionExpCanceledDate'
    );
    const user = this.profile.userCode;
    // Check if controls exist before setting their values
    if (
      distributionExpCanceledUserControl &&
      distributionExpCanceledDateControl
    ) {
      distributionExpCanceledUserControl.setValue(user);
      const currentDate = new Date();
      const date = this.datePipe.transform(
        currentDate,
        this.dateFormat('reportDateTimeFormat')
      );

      distributionExpCanceledDateControl.setValue(date);
    }
  }
  isSystemAdmin() {
    // Destructure form controls
    const {
      notificationReportedDate,
      notificationMatDamageId,
      notificationContactName,
      lossTowDriverRelationshipId,
      lossTowDriverName,
      lossTowNbrVehInvolved,
      lossTowEreportedById,
      lossTowReportedById,
      sysCreatedBy,
      carSelfSurveyUrl,
      lossTowExpertNamePreference,
      lossTowLossDate,
      distributionTownDescription,
      distributionExpCanceledUser,
      distributionExpCanceledDate,
      distributionTownName,
      distributionLossDistributionBoolean,
      distributionLossDistDate,
      distributionLossDistUser,
      distributionLossArrivedDate,
      distributionLossArrivedUser,
      distributionExpTypeId,
      expertMobilePhone,
      distributionTownId,
      distributionExpExpertId,
      distributionExpTypeDate,
      distributionExpTypeUser,
      delayedDispatchTime,
      distributionTema,
      supplierName,
      lossTowRsDesc,
      towFromTownDescription,
      towToTownDescription,
      distributionTowDistDateBoolean,
      distributionTowDistDate,
      distributionTowArrivedUser,
      delayedTowingTime,
      distributionTowArrivedDate,
      distributionTowTotalKm,
      distributionTowExtraKm,
      distributionTowClientCost,
      totaleDurationBetweenTown,
      distributionExpExpertDesc,
      towingComDesc,
    } = this.form.controls;
    if (distributionExpCanceledDate) {
      const dateFormat = distributionExpCanceledDate.value;
      const formattedDate = this.datePipe.transform(
        dateFormat,
        this.dateFormat('reportDateTimeFormat')
      );

      // Update the value in the control
      distributionExpCanceledDate.setValue(formattedDate);
    }

    // distributionExpCanceledDate.valueChanges.subscribe((valueChanges) => {
    //   const format = this.datePipe.transform(
    //     valueChanges,
    //     this.dateFormat('reportDateTimeFormat')
    //   );
    //   distributionExpCanceledDate.setValue(format);
    // });
    // Constants for permissions
    const ccSystemAdmin = this.hasPerm('ccSystemAdmin');
    const ccManager = this.hasPerm('ccManager');
    distributionTownDescription.disable();
    distributionExpCanceledUser.disable();
    distributionExpCanceledDate.disable();
    distributionLossDistributionBoolean.disable();
    distributionLossDistDate.disable();
    distributionLossDistUser.disable();
    distributionLossArrivedDate.disable();
    distributionLossArrivedUser.disable();
    distributionExpTypeId.disable();
    expertMobilePhone.disable();
    distributionExpExpertDesc.disable();
    distributionExpTypeDate?.disable();
    distributionExpTypeUser?.disable();
    delayedDispatchTime.disable();
    distributionTema.disable();
    supplierName.disable();
    lossTowRsDesc.disable();
    towFromTownDescription.disable();
    towToTownDescription.disable();
    distributionTowDistDateBoolean.disable();
    distributionTowDistDate.disable();
    distributionTowArrivedUser.disable();
    delayedTowingTime.disable();
    distributionTowArrivedDate.disable();
    distributionTowTotalKm.disable();
    distributionTowExtraKm.disable();
    distributionTowClientCost.disable();
    totaleDurationBetweenTown.disable();
    towingComDesc.disable();
    // Constants for policy data
    const {
      notificationStatusCode,
      reportedDay,
      notificationMatDamageId: policyMatDamageId,
    } = this.policyData!;

    // Disable controls based on conditions
    sysCreatedBy?.disable();
    carSelfSurveyUrl?.disable();

    if (!ccSystemAdmin) {
      notificationReportedDate?.disable();
    }

    if (
      (notificationStatusCode === '0' && reportedDay === 0) ||
      !ccManager ||
      !ccSystemAdmin
    ) {
      notificationMatDamageId?.disable();
      lossTowLossDate?.disable();
    }

    if (policyMatDamageId === '6') {
      notificationMatDamageId?.disable();
      notificationContactName?.disable();
      lossTowDriverRelationshipId?.disable();
      lossTowDriverName?.disable();
      lossTowNbrVehInvolved?.disable();
    }

    if (lossTowReportedById?.value !== '6' || policyMatDamageId === '6') {
      lossTowEreportedById?.disable();
    }

    if (
      policyMatDamageId === '6' ||
      lossTowExpertNamePreference?.value === ' '
    ) {
      lossTowExpertNamePreference?.disable();
    }
  }
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
  private formatDateTime(dateTime: Date): string {
    // const parsedDate = moment(dateTime, 'DD/MM/yyyy HH:mm A').toDate();
    return this.datePipe.transform(
      dateTime,
      this.dateFormat('reportDateTimeFormat')
    )!;
  }
  onDistributionTowArived() {
    const distributionLossArrivedBoolean = this.form.get(
      'distributionLossArrivedBoolean'
    )?.value;
    this.form.get('distributionLossArrivedDate')?.setValue(new Date());

    if (distributionLossArrivedBoolean) {
      this.customerSatisfactionDialog('ED');
    } else {
      this.form.get('distributionLossArrivedDate')?.setValue(null);
      this.form.get('distributionLossArrivedUser')?.setValue(null);
    }
  }
  private patchFormWithPolicyData(): void {
    if (this.policyData) {
      const lossDate = this.formatDateTime(this.policyData?.lossTowLossDate!);
      const arrivedDate = this.formatDateTime(
        this.policyData?.distributionLossArrivedDate!
      );
      const lossDistDate = this.formatDateTime(
        this.policyData?.distributionLossDistDate!
      );
      const reportedDate = this.formatDateTime(
        this.policyData?.notificationReportedDate!
      );
      const distributionExpTypeDate = this.formatDateTime(
        this.policyData?.distributionExpTypeDate!
      );
      const distributionLossDistributionBoolean =
        this.policyData?.distributionLossDistributionBoolean === 'Y'
          ? true
          : false;
      const distributionLossArrivedBoolean =
        this.policyData?.distributionLossArrivedBoolean === 'Y' ? true : false;
      const sysCreatedBy =
        this.policyData?.carsContactsPhoneList![0]?.sysCreatedBy;
      // this.getSupplierFindById();
      const distributionTowDistDate = this.formatDateTime(
        this.policyData?.distributionTowDistDate!
      );
      const distributionTowArrivedDate = this.formatDateTime(
        this.policyData?.distributionTowArrivedDate!
      );
      this.carsDispatchFollowUpList = this.policyData?.carsDispatchFollowUpList;
      if (this.disableLossDate()) {
        this.form.get('distributionLossDistDate')?.disable();
      }
      const distributionLossDistDate = this.formatDateTime(
        this.policyData?.distributionLossDistDate!
      );
      this.lossCarId = this.policyData?.lossCarId;
      const lossTowExpertId = this.policyData?.lossTowExpertId;
      // this.notificationId
      // const lossTowExpertNamePreferenceById = this.form
      //   .get('lossTowExpertNamePreferenceById')
      //   ?.patchValue(lossTowExpertId);
      // console.log(lossTowExpertId);
      this.form.patchValue({
        ...this.policyData,
        lossTowLossDate: lossDate,
        notificationReportedDate: reportedDate,
        distributionLossDistDate: lossDistDate,
        distributionLossArrivedDate: arrivedDate,
        distributionLossDistributionBoolean:
          distributionLossDistributionBoolean,
        distributionLossArrivedBoolean: distributionLossArrivedBoolean,
        distributionExpTypeDate: distributionExpTypeDate,
        sysCreatedBy: sysCreatedBy,
        distributionTowDistDate: distributionTowDistDate,
        distributionTowArrivedDate: distributionTowArrivedDate,
        lossTowExpertNamePreferenceById: lossTowExpertId,
        // distributionLossDistDate: distributionLossDistDate,
      });
      this.isSystemAdmin();
      // this.getTownById();
    }
    // console.log(distributionTowArrivedDateBoolean);
  }
  shouldDisableNoData(): boolean {
    const hasSuperAdminPermission = this.hasPerm('ccSuperAdmin');
    const isButtonVisible = this.policyData?.buttonVisibility;
    const notificationStatusCode = this.policyData?.notificationStatusCode;
    const hasSystemAdminPermission = this.hasPerm('ccSystemAdmin');

    // Disable if any of the following conditions are met
    return (
      (!(hasSuperAdminPermission || isButtonVisible) || // Condition 1
        notificationStatusCode === '8' || // Condition 2
        notificationStatusCode === '9') && // Condition 3
      !hasSystemAdminPermission
    ); // Condition 4
  }
  // to be discuused send the code and get the description of it only
  getTownDesc() {
    const getTownCode = this.form.get('distributionTownName')?.value; // Get the selected code from the form control
    // Get the selected code from the form control
    this.dataService.getAddresses('').subscribe({
      next: (result) => {
        if (getTownCode) {
          const data = result.data?.find(
            (value: any) => value.code === getTownCode
          );
          console.log(data);
          if (data) {
            const description = data.description;
            // console.log(description);
            this.form.patchValue({ distributionTownName: description }); // Update the description in the form control
          }
        }
      },
    });
  }

  searchForTerritory(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataService.getTownFindByName(event.term).subscribe({
        next: (res) => {
          this.territoryValues = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 300);
  }
  // getTownById() {
  //   const getTownCode = this.form.get('distributionTownId'); // Get the selected code from the form control
  //   this.dataService.getTownById(getTownCode?.value).subscribe({
  //     next: (result) => {
  //       this.addressCode = result.data;
  //       getTownCode?.setValue(result.data.code);
  //       // getTownCode?.patchValue(result.data.description);
  //       console.log(result);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }

  disableDeleteExpertUnAvai(): boolean {
    const expertUnavailableList = this.policyData?.expertUnavailableList;
    const notificationStatusCode = this.policyData?.notificationStatusCode;
    const hasPermission = this.hasPerm('ccSystemAdmin');

    return (
      (expertUnavailableList === null ||
        notificationStatusCode === '8' ||
        notificationStatusCode === '9') &&
      !hasPermission
    );
  }
  DisableIcons(): boolean {
    const notificationStatusCode = this.policyData?.notificationStatusCode;
    // const distributionTownNameBind = this.policyData?.distributionTownNameBind;
    const hasSystemAdminPermission = this.hasPerm('ccSystemAdmin');
    const distributionTownNameBind = this.form.get(
      'distributionTownName'
    )?.value;
    // Disable if any of the following conditions are met
    return (
      (distributionTownNameBind === null ||
        notificationStatusCode === '8' ||
        notificationStatusCode === '9') &&
      !hasSystemAdminPermission
    );
  }

  DisableChooseManually(): boolean {
    const notificationStatusCode = this.policyData?.notificationStatusCode;
    const distributionExpTypeId = this.policyData?.distributionExpTypeId;
    // const distributionTownNameBind = this.policyData?.distributionTownNameBind;
    const hasSystemAdminPermission = this.hasPerm('ccSystemAdmin');
    const distributionTownNameBind = this.form.get(
      'distributionTownName'
    )?.value;
    // Disable if any of the following conditions are met
    return (
      (distributionExpTypeId === 'X' ||
        distributionTownNameBind === null ||
        notificationStatusCode === '8' ||
        notificationStatusCode === '9') &&
      !hasSystemAdminPermission
    );
  }
  shouldDisableEdit(): boolean {
    const hasChangePolAdminPermission = this.hasPerm('ccChangePolAdmin');
    const notificationStatusCode = this.policyData?.notificationStatusCode;
    const hasAdminPermission = this.hasPerm('ccAdmin');
    const hasSuperAdminPermission = this.hasPerm('ccSuperAdmin');
    const lossTowClaimNumber = this.policyData?.lossTowClaimNumber;

    return hasChangePolAdminPermission
      ? false // Expression 1
      : notificationStatusCode === '8' ||
        notificationStatusCode === '9' || // Expression 2
        lossTowClaimNumber !== null
      ? true // Expression 3
      : hasAdminPermission || hasSuperAdminPermission
      ? false
      : true; // Expression 4
  }
  deleteExpertUnavailable(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteExpertUnavailable(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.getPolicyCarByNotificationId(this.notificationId!);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
          },
        });
      }
    );
  }
  private async getPolicyCarByNotificationId(
    notificationId: string
  ): Promise<void> {
    try {
      const res = await this.dataService
        .getPolicyCarByNotificationId(notificationId)
        .toPromise();
      this.policyData = res?.data;
      this.patchFormWithPolicyData();
      this.configList();
    } catch (err) {
      console.error(err);
    }
  }
  getReportedByLovFindAll() {
    this.dataService.getReportedByLovFindAll().subscribe({
      next: (res) => {
        this.reportedByData = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getRelationToOwnerLovFindAll() {
    this.dataService.getRelationToOwnerLovFindAll().subscribe({
      next: (res) => {
        this.relationToOwnerData = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getNotificationNatureLovFindAll() {
    this.dataService.getNotificationNatureLovFindAll().subscribe({
      next: (res) => {
        this.natureLov = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getEReportedByLovFindAll() {
    this.dataService.getEReportedByLovFindAll().subscribe({
      next: (res) => {
        this.eReportedBy = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  carRespReasonCode() {
    this.dataService.carRespReasonCode().subscribe({
      next: (res) => {
        this.carRespReasonCodeValues = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;

        const newRecord = {
          companyId: 'ALL',
          companyName: 'ALL',
        };
        this.companies?.push(newRecord);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  createNoDataDialog() {
    if (this.displayName) {
      const dialogData = this.dialog.open(CreateNoDataDialogComponent, {
        data: {
          formData: this.formData,
          displayname: this.displayName,
        },
        width: '780px',
        height: '550px',
      });
      dialogData.afterClosed().subscribe((data) => {
        if (data !== undefined && data !== null) {
          this.formData = data;
        }
      });
    }
  }
  changeToAvaiDataDialog() {
    // Destructure the relevant properties from this.policyData
    const { insuranceId, lossTowLossDate } = this.policyData || {};

    const dialogData = {
      insuranceId,
      lossTowLossDate,
      changeAvailableData: this.changeAvailableData,
      polserno: this.polserno,
      policyData: this.policySearchData,
      companies: this.companies,
      createNoData: this.formData,
    };

    const dialogRef = this.dialog.open(ChangeToAvailableDataComponent, {
      width: '780px',
      height: '650px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data) => {
      // Update this.changeAvailableData only if data is not null or undefined
      if (data !== undefined && data !== null) {
        this.changeAvailableData = data;
      }
    });
  }
  getExpCancelReasonLovFindAll() {
    this.dataService.getExpCancelReasonLovFindAll().subscribe({
      next: (res) => {
        this.ExpCancelReas = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  appExpertDispatch() {
    if (this.policyData) {
      this.dialog.open(AppExpertDispatchDialogComponent, {
        data: {
          notificationVisa: this.policyData!.notificationVisa,
          city: this.policyData!.distributionTownName,
          companies: this.companies,
          insuranceCompany: this.policyData!.insuranceId,
        },
        width: '650px',
        height: '250px',
      });
    }
  }
  getTowFromTownDescription(event: any) {
    const town1 = this.form.get('fromTowTownName')?.value;
    if (town1) {
      this.dataService.getTownFindById(town1).subscribe({
        next: (res) => {
          const data = res.data;
          this.form
            .get('towFromTownDescription')
            ?.setValue(data.cazaDescription + ' ' + data.regionDescription);
          this.form.get('towFromTownId')?.setValue(event);
        },
      });
    }
  }
  getTowToTownDescription(event: any) {
    const town2 = this.form.get('towToTownName')?.value;
    if (town2) {
      this.dataService.getTownFindById(town2).subscribe({
        next: (res) => {
          const data = res.data;
          this.form
            .get('towToTownDescription')
            ?.setValue(data.cazaDescription + ' ' + data.regionDescription);
          this.form.get('towToTownId')?.setValue(event);
        },
      });
    }
  }
  getTownFindById(event: any) {
    // const town = this.form.get('distributionTownId')?.value;

    if (event) {
      this.dataService.getTownFindById(event).subscribe({
        next: (res) => {
          const data = res.data;

          this.form
            .get('distributionTownDescription')
            ?.setValue(data.cazaDescription + ' ' + data.regionDescription);
          // this.form.get('distributionTownNameBind')?.setValue(data.townName);
          // this.form.get('distributionTown')?.setValue(data);
          this.form.get('distributionTownId')?.setValue(event);
          // this.form.get('distributionTownName')?.setValue(data.townName);

          if (
            this.policyData?.notificationMatDamageId === '5' ||
            this.policyData?.notificationMatDamageId === '10'
          ) {
            // this.form.get('towFromTown')?.setValue(data);
            this.form.get('fromTowTownName')?.setValue(data.townName);
            this.form.get('towFromTownId')?.setValue(data.townId);
          }
        },
      });
    }
  }

  chooseManuallyDialog() {
    const userCode = this.profile.userCode;
    if (this.policyData) {
      const dialogRef = this.dialog.open(ChooseManuallyComponent, {
        data: {
          telExtension: this.telExtension,
          showTelIcon: this.showTelIcon,
          insuranceId: this.policyData?.insuranceId,
        },
        width: '1300px',
        height: '700px',
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.form.get('distributionExpTypeId')?.setValue('1');
          this.form.get('distributionExpTypeUser')?.setValue(userCode);
          this.form.get('distributionExpTypeDate')?.setValue(new Date());
          this.form.get('lossTowNeedExpertReportBoolean')?.setValue(true);
          this.form
            .get('lossTowExpertNamePreference')
            ?.setValue(data.supplierName);
          this.form.get('distributionExpExpertId')?.setValue(data.supplierId);
          this.form
            .get('distributionExpExpertDesc')
            ?.setValue(data.supplierName);
          this.form.get('lossTowExpertId')?.setValue(data.supplierId);
          this.form.get('distributionExpCanceledId')?.setValue(null);
          this.form.get('distributionExpCanceledUser')?.setValue(null);
          this.form.get('distributionExpCanceledDate')?.setValue(null);
          const notificationReportedDate =
            this.policyData?.notificationReportedDate!;
          this.calculateDelay(notificationReportedDate);
          if (data.direction === 'Direct') {
            this.form.get('distributionLossArrivedDate')?.setValue(new Date());
            this.form.get('distributionLossArrivedUser')?.setValue(userCode);
            this.form.get('distributionLossArrivedBoolean')?.setValue(true);
            this.form.get('distributionLossDistDate')?.setValue(new Date());
            this.form.get('distributionLossDistUser')?.setValue(userCode);
            this.form.get('distributionTema')?.setValue('N');
            this.form
              .get('distributionLossDistributionBoolean')
              ?.setValue(true);
          } else {
            this.form.get('distributionLossDistDate')?.setValue(new Date());
            this.form.get('distributionLossDistUser')?.setValue(userCode);
            this.form.get('distributionTema')?.setValue('N');
            this.form
              .get('distributionLossDistributionBoolean')
              ?.setValue(true);
            this.form.get('distributionLossArrivedDate')?.setValue(null);
            this.form.get('distributionLossArrivedUser')?.setValue(null);
            this.form.get('distributionLossArrivedBoolean')?.setValue(false);
          }
          const inOutNetwork = data.expertInOutNet;

          if (inOutNetwork === 'Y') {
            this.form.get('lossTowExpertMan')?.setValue('Y');
            this.form.get('lossTowExpertRot')?.setValue('Z');
          } else {
            if (this.ccRotationManual === 'true') {
              const dialog = this.dialog.open(RotationDialogComponent);
              dialog.afterClosed().subscribe((res) => {
                if (res === 'Y') {
                  // console.log(res);
                  this.form.get('lossTowExpertMan')?.setValue('Y');
                  this.form.get('lossTowExpertRot')?.setValue('Y');
                } else {
                  this.form.get('lossTowExpertMan')?.setValue('Y');
                  this.form.get('lossTowExpertRot')?.setValue('N');
                }
              });
            }
          }
        }
      });
    }
  }
  calculateDelay(reportedDate: Date) {
    // Simulate the notificationReportedDate
    const notificationReportedDate = this.policyData?.notificationReportedDate!;
    // console.log(notificationReportedDate);
    // Convert the notificationReportedDate string to a JavaScript Date object
    const reported = new Date(reportedDate);
    // console.log(reported);
    // Convert the JavaScript Date to a LocalDateTime-like object
    const localDateTime = {
      year: reported.getFullYear(),
      month: reported.getMonth() + 1, // Months are 0-indexed in JavaScript
      dayOfMonth: reported.getDate(),
      hour: reported.getHours(),
      minute: reported.getMinutes(),
    };
    // console.log(localDateTime);
    // Get the current date and time
    const now = new Date();

    // Calculate the difference in minutes and hours
    const diffInMinutes = Math.floor(
      (now.getTime() - reported.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);

    // Create the delayedDispatchTime string
    const delayedDispatchTime = `${diffInHours} hours, ${diffInMinutes} minutes`;
    // console.log(delayedDispatchTime);
    this.form.get('delayedDispatchTime')?.setValue(delayedDispatchTime);
    // Assign delayedDispatchTime to your Angular property
    // this.delayedDispatchTime = delayedDispatchTime;
  }

  // Define a property to hold delayedDispatchTime

  addBodilyInjuryDialog() {
    const dialog = this.dialog.open(AddBodilyInjuryDialogComponent, {
      data: {
        bodilyInjury: this.bodilyInjury,
        severity: this.severity,
      },
      width: '400px',
      height: '200px',
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.form.get('lossTowBodilyCaseId')?.setValue(data.bodilyInjury);
        this.form.get('lossTowSeverity')?.setValue(data.severity);
        this.bodilyInjury = data.bodilyInjury;
        this.severity = data.severity;
      }
    });
  }
  getExpertDispatchTypeLovFindAll() {
    this.dataService.getExpertDispatchTypeLovFindAll().subscribe({
      next: (res) => {
        this.expertDispatchType = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  secondExpertDialog() {
    if (this.policyData) {
      const dialoRef = this.dialog.open(SecondExpertDialogComponent, {
        width: '1100px',
        height: '730px',
      });
      dialoRef.afterClosed().subscribe((data) => {
        if (data) {
          this.form.get('supplierName')?.setValue(data.experName);
          this.form.get('lossTow2ndExpertId')?.setValue(data.supplierId);
        }
      });
    }
  }
  selectRowExpert(index: number): void {
    this.selectedRowIndex = index;
  }
  async getTowingCondAccAndMechCount(companyId: string) {
    const insuranceId = this.policyData?.insuranceId;

    try {
      const result = await lastValueFrom(
        this.dataService.getTowingCondAccAndMechCount(insuranceId!, companyId)
      );

      this.towingCondAccAndMec = result!.data;
      // console.log(this.towingCondAccAndMec);
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error for the calling function to handle
    }
  }
  async selectRowTowingCompany(index: number, selectedRow: any) {
    this.selectedRowIndex = index;
    this.selectedTowingCmp = selectedRow;

    const companyId = this.selectedTowingCmp?.supplierId;
    const natureId = this.policyData?.distributionTowNatureId;

    if (
      natureId &&
      natureId !== '1' &&
      natureId !== '7' &&
      this.policyData!.insuranceId &&
      companyId
    ) {
      try {
        await this.getTowingCondAccAndMechCount(companyId);

        if (
          this.policyData &&
          this.policyData.towingListCount &&
          this.towingCondAccAndMec &&
          this.towingCondAccAndMec.length > 0
        ) {
          const obj = this.towingCondAccAndMec[0];
          console.log(obj);
          const mech = Number(obj[1]);
          // console.log(mech);
          if (mech) {
            if (mech > this.policyData.towingListCount) {
              this.towingAlertRen = 'N';
            } else {
              this.towingAlertRen = 'Y';
            }
            console.log(this.towingAlertRen);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  saveSuggestTowingCmp() {
    const hasCcTowingMapPermission = this.hasPerm('ccTowingMap');

    if (hasCcTowingMapPermission) {
      this.loadMapDataFields(); //TODO:
      this.calculateTowingKmAndCost(); //TODO
    }

    if (this.policyData?.towingCompanyList) {
      const selectedTowingCompany = this.selectedTowingCmp?.name;
      const supplierId = this.selectedTowingCmp?.supplierId;

      this.form.get('towingComDesc')?.setValue(selectedTowingCompany);
      this.form.get('towingComId')?.setValue(supplierId);

      const user = this.profileService.getUser();
      const distributionTowDistDateControl = this.form.get(
        'distributionTowDistDate'
      );
      distributionTowDistDateControl?.setValue(new Date());

      const distributionTowDistUserControl = this.form.get(
        'distributionTowDistUser'
      );
      distributionTowDistUserControl?.setValue(user);

      const distributionTowDistDateBooleanControl = this.form.get(
        'distributionTowDistDateBoolean'
      );
      distributionTowDistDateBooleanControl?.setValue(true);

      let reported = null;

      const notificationMatChangeDate = this.policyData
        ?.notificationMatChangeDate
        ? new Date(this.policyData.notificationMatChangeDate)
        : null;

      if (notificationMatChangeDate) {
        reported = notificationMatChangeDate;
      } else {
        reported = new Date(this.policyData.notificationReportedDate!);
      }
      this.calculateTowDispatchDelay(reported);
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    }
  }
  calculateTowDispatchDelay(reportedDate: Date) {
    // Simulate the notificationReportedDate
    // const notificationReportedDate = this.policyData?.notificationReportedDate!;
    // console.log(notificationReportedDate);
    // Convert the notificationReportedDate string to a JavaScript Date object
    const reported = new Date(reportedDate);
    // console.log(reported);
    // Convert the JavaScript Date to a LocalDateTime-like object
    const localDateTime = {
      year: reported.getFullYear(),
      month: reported.getMonth() + 1, // Months are 0-indexed in JavaScript
      dayOfMonth: reported.getDate(),
      hour: reported.getHours(),
      minute: reported.getMinutes(),
    };
    // console.log(localDateTime);
    // Get the current date and time
    const now = new Date();

    // Calculate the difference in minutes and hours
    const diffInMinutes = Math.floor(
      (now.getTime() - reported.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);

    // Create the delayedDispatchTime string
    const delayedTowingTime = `${diffInHours} hours, ${diffInMinutes} minutes`;
    // console.log(delayedTowingTime);
    this.form.get('delayedTowingTime')?.setValue(delayedTowingTime);
    // Assign delayedDispatchTime to your Angular property
    // this.delayedDispatchTime = delayedDispatchTime;
  }
  cancel() {
    this.dialogRef.close();
  }
  // console.log(this.selectedTowingCmp);
  loadMapDataFields() {}
  calculateTowingKmAndCost() {}
  openDispatchExpertDialog() {
    this.showrelated = 'Y';

    const dialogRef = this.dialog.open(ExpertDispatchComponent, {
      data: {
        insuranceId: this.policyData?.insuranceId,
        insuranceDesc: this.policyData?.insuranceDesc,
        distributionTownId: this.policyData?.distributionTownId,
        notificationMatDamageId: this.policyData?.notificationMatDamageId,
        notificationReportedDate: this.policyData?.notificationReportedDate,
        notificationId: this.notificationId,
        townTerritoryList: this.policyData?.townTerritoryList,
        telExtension: this.telExtension,
        showTelIcon: this.showTelIcon,
        lossTowId: this.policyData?.lossTowId,
      },
      width: '600px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      // this.getPolicyCarByNotificationId(this.notificationId!);
      if (data?.dispatch) {
        const distributionTownName = this.form.get(
          'distributionTownName'
        )?.value;
        const { oclaimExpert, oclaimexpertname } = data;

        if (distributionTownName && oclaimExpert) {
          this.handleClaimExpertSelection(oclaimExpert, oclaimexpertname);
        } else {
          this.handleClaimExpertDeselection();
        }
      } else {
        if (data) {
          this.noExpert();
        }
      }
    });
  }
  handleClaimExpertSelection(oclaimExpert: string, oclaimexpertname: string) {
    const userCode = this.profileService.getUser();

    this.form.get('distributionExpExpertId')?.setValue(oclaimExpert);
    this.form.get('distributionExpExpertDesc')?.setValue(oclaimexpertname);
    this.form.get('distributionExpTypeId')?.setValue('X');
    this.form.get('distributionExpTypeUser')?.setValue(userCode);
    this.form.get('distributionExpTypeDate')?.setValue(new Date());
    this.form.get('lossTowExpertId')?.setValue(oclaimExpert);
    this.form.get('distributionLossDistDate')?.setValue(new Date());
    this.form.get('distributionLossDistUser')?.setValue(userCode);
    this.form.get('lossTowExpertNamePreference')?.setValue(oclaimexpertname);
    this.form.get('lossTowExpertNamePreferenceById')?.setValue(oclaimExpert);
    this.form.get('distributionTema')?.setValue('N');
    this.form.get('distributionLossDistributionBoolean')?.setValue(true);
    this.form.get('lossTowNeedExpertReportBoolean')?.setValue(true);
    this.form.get('lossTowExpertMan')?.setValue('Y');
    this.calculateDelay(this.policyData?.notificationReportedDate!);

    // console.log('Dispatch:', data?.dispatch);
  }

  handleClaimExpertDeselection() {
    this.form.get('delayedDispatchTime')?.setValue('');
    this.form.get('distributionExpTypeId')?.setValue('');
    this.form.get('distributionExpExpertId')?.setValue('');
    this.form.get('distributionExpExpertDesc')?.setValue('');
    this.form.get('lossTowExpertNamePreference')?.setValue('');
    this.form.get('lossTowExpertNamePreferenceById')?.setValue('');
    this.form.get('distributionExpTypeUser')?.setValue(null);
    this.form.get('distributionExpTypeDate')?.setValue(null);
    this.form.get('lossTowExpertId')?.setValue(null);
    this.form.get('distributionLossDistDate')?.setValue(null);
    this.form.get('distributionLossDistUser')?.setValue(null);
    this.form.get('distributionLossDistributionBoolean')?.setValue(false);
    this.form.get('lossTowNeedExpertReportBoolean')?.setValue(false);
  }
  dispatchExpert() {}
  customerSatisfactionDialog(type: string) {
    if (this.policyData) {
      const dialogRef = this.dialog.open(CustomerSatisfactionDialogComponent, {
        data: {
          carPlate: this.policyData?.carPlate,
          brandDescription: this.policyData?.brandDescription,
          notificationContactName: this.policyData?.notificationContactName,
          notificationContactPhone: this.policyData?.notificationContactPhone,
          towFromTownDescription: this.policyData?.towFromTownDescription,
          towToTownDescription: this.policyData?.towToTownDescription,
          towingComDesc: this.policyData?.towingComDesc,
          notificationMatDamageDesc: this.policyData?.notificationMatDamageDesc,
          distributionLossDistDate: this.policyData?.distributionLossDistDate,
          carsDispatchFollowUpList: this.policyData?.carsDispatchFollowUpList,
          notificationId: this.policyData?.notificationId,
          domainYn: this.domainYn,
          distributionLossArrivedBoolean: this.form.get(
            //check
            'distributionLossArrivedBoolean'
          )?.value,
          distributionLossArrivedDate: this.form.get(
            'distributionLossArrivedDate'
          )?.value,
          distributionTowArrivedDate: this.form.get(
            'distributionTowArrivedDate'
          )?.value,
          distributionTowDistDate: this.form.get('distributionTowDistDate')
            ?.value,
          type: type,
        },
        width: '2000px',
        height: '700px',
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.form
            .get('carsDispatchFollowUp')
            ?.patchValue([data.customerSatis]);
          this.form
            .get('distributionLossArrivedBoolean')
            ?.patchValue(data.distributionLossArrivedBoolean);
          this.form
            .get('distributionLossArrivedDate')
            ?.patchValue(data.distributionLossArrivedDate);
          this.form
            .get('distributionLossArrivedUser')
            ?.patchValue(data.distributionLossArrivedUser);
          // const data2 = this.form.get('carsDispatchFollowUp')?.value;
          // console.log(data2[0]);
          // this.getPolicyCarByNotificationId(this.policyData?.notificationId!);
          // console.log(data);
        }
      });
    }
  }
  navigateToMail() {
    if (this.policyData) {
      const carId = this.policyData?.lossCarId;
      const componentRoute = `sendEmail/${carId}`;
      this.router.navigateByUrl(componentRoute);
    }
  }
  viewPolicy() {
    if (this.policyData) {
      this.dialog.open(ViewPolicyDialogComponent, {
        data: {
          carId: this.policyData?.carId,
        },
        width: '1000px',
        maxHeight: '600px',
      });
    }
  }
  getTowCancelReasonLovFindAll() {
    this.dataService.getTowCancelReasonLovFindAll().subscribe({
      next: (res) => {
        this.towCancelReason = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  dispatchTowingShow(): boolean {
    return (
      this.policyData?.notificationMatDamageId === '5' ||
      this.policyData?.notificationMatDamageId === '6' ||
      this.policyData?.notificationMatDamageId === '10'
    );
  }
  shouldShowDistributionTowNatureLink(): boolean {
    return (
      this.policyData?.distributionTowNatureId !== null ||
      this.policyData?.distributionTowNatureId !== '0'
    );
  }
  isSuggestLinkDisabled(): boolean {
    return (
      this.policyData?.notificationStatusCode === '8' ||
      (this.policyData?.notificationStatusCode === '9' &&
        !this.hasPerm('ccSystemAdmin'))
    );
  }
  showRepairShop(): boolean {
    return (
      this.policyData?.notificationStatusCode === '8' ||
      this.policyData?.notificationStatusCode === '9'
    );
  }
  getTowingNatureLovFindAll() {
    this.dataService.getTowingNatureLovFindAll().subscribe({
      next: (res) => {
        this.towNatureLov = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getSupplierGarageLov() {
    this.dataService.getSupplierGarageLov().subscribe({
      next: (res) => {
        this.supplierGarageLov = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
