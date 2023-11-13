import { DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

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
import {
  Observable,
  Subscription,
  catchError,
  forkJoin,
  lastValueFrom,
  map,
  of,
} from 'rxjs';
import { TowingConditionComponent } from '../towing-condition/towing-condition.component';
import { TowingConditionsHotlineComponent } from './towing-conditions-hotline/towing-conditions-hotline.component';
import { RepairShopDialogComponent } from './repair-shop-dialog/repair-shop-dialog.component';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';
import { ClaimsDialogComponent } from './claims-dialog/claims-dialog.component';
import { TowCasesDialogComponent } from './tow-cases-dialog/tow-cases-dialog.component';
import { NotificationRequest } from 'src/app/model/request/notification-request';
import { TowConditionsDialogComponent } from './tow-conditions-dialog/tow-conditions-dialog.component';

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
  changeCo: string = 'N';
  presultdouble1?: string;
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
  userCode?: string;
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
  milageAcc: number | null = null;
  milageMech: number | null = null;
  milagePrivate: number | null = null;
  milagePublic: number | null = null;
  clientCost: number | null = null;
  isPublic: boolean = false;

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
      this.dialogRef = this.dialog.open(TowConditionsDialogComponent, {
        width: '800px',
        height: '200px',
        data: {
          domainYn: this.domainYn,
          lossTowBlockedId: this.form.get('lossTowBlockedId')?.value,
          lossTowLifterId: this.form.get('lossTowLifterId')?.value,
          lossTowOffRoadId: this.form.get('lossTowOffRoadId')?.value,
          lossTowPickUpId: this.form.get('lossTowPickUpId')?.value,
          lossTowWheelId: this.form.get('lossTowWheelId')?.value,
          lossTowCarryingGoodId: this.form.get('lossTowCarryingGoodId')?.value,
        },
      });
      this.dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          // console.log(res);
          this.form.patchValue(res);
        }
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
          this.notificationId = data.notificationId;
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
          this.notificationId = data.notificationId;
          this.policyData = data;
          this.form.patchValue(data);
          this.patchFormWithPolicyData();
        }
      });
    }
  }

  openRepairShopeDialog() {
    if (this.policyData) {
      const dialogRef = this.dialog.open(RepairShopDialogComponent, {
        width: '1100px',
        height: '730px',
        data: {
          telExtension: this.telExtension,
          showTelIcon: this.showTelIcon,
          notificationStatusCode: this.policyData?.notificationStatusCode,
        },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.form.get('lossTowRsId')?.setValue(data.supplierId);
          this.form.get('lossTowRsDesc')?.setValue(data.supplierName);
        }
      });
    }
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
    // this.onNotificationMatDamageChange();
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
      this.getUserProfileInfo();
      this.getTowingNatureLovFindAll();
      this.getDomainYN();
      this.getTowCancelReasonLovFindAll();
      this.getTowDelayReasonLovFindAll();
      this.getSupplierGarageLov();
    });
  }
  getUserProfileInfo() {
    this.profile = this.profileService.getSelectedProfile();
    this.userCode = this.profileService.getUser();
    this.displayName = this.profileService.getDisplayName();
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
      notificationId: [''],
      lossTowLossDate: ['', Validators.required],
      notificationReportedDate: [null, Validators.required],
      lossTowReportedById: ['', Validators.required],
      notificationContactName: [''],
      lossTowDriverRelationshipId: ['', Validators.required],
      lossTowDriverName: [''],
      notificationContactPhone: [''],
      lossTowNbrVehInvolved: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      lossTowEreportedById: [''],
      notificationMatDamageId: [''],

      sysCreatedBy: [''],
      carSelfSurveyUrl: [''],
      lossTowExpertNamePreference: [''],
      carRespReasonCode: [''],
      distributionExpCanceledId: [''],
      distributionTownName: [''],
      distributionTownDescription: [''],
      lossTow2ndExpertName: [''],
      distributionExpCanceledUser: [''],
      distributionExpCanceledUserName: [''],
      distributionExpCanceledDate: [null],
      lossTowSeverity: [''],
      lossTowBodilyCaseId: [''],
      distributionExpTypeId: [''],
      lossTow2ndExpertId: [''],
      distributionLossDistributionBoolean: [''],
      // distributionLossDistDate: [null],
      distributionLossDistUser: [''],
      distributionLossDistUserName: [''],
      distributionLossArrivedBoolean: [false],
      distributionLossArrivedDate: [null],
      distributionLossArrivedUser: [''],
      distributionLossArrivedUserName: [''],
      expertMobilePhone: [''],
      distributionTownId: [''],
      distributionExpExpertId: [''],
      distributionExpTypeDate: [null],
      distributionExpTypeUser: [''],
      distributionExpTypeUserName: [''],
      // distributionTownNameBind: [''],
      distributionTown: [''],
      // towFromTown : [''],
      fromTowTownName: [''],
      delayedDispatchTime: [''],
      lossTowStaffCaseMngr: [''],
      lossTowExpertId: [''],
      lossTowExpertMan: [''],
      lossTowExpertRot: [''],
      distributionTema: [''],
      // distributionLossDistribution: [''],
      // distributionLossArrived: [''],
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
      distributionTowDistUser: [''],
      distributionTowDistUserName: [''],
      distributionTowArrivedUser: [''],
      distributionTowArrivedUserName: [''],
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
      distributionTowTotalCost: ['', Validators.pattern('^[0-9]*$')],
      totaleDurationBetweenTown: [''],
      lossTowBlockedId: [''],
      lossTowWheelId: [''],
      lossTowPickUpId: [''],
      lossTowOffRoadId: [''],
      lossTowCarryingGoodId: [''],
      lossTowLifterId: [''],
      towingComDesc: [''],
      distributionLossDistDate: [''],
      towingComId: [''],
      lossTowRsId: [''],
      distributionExpExpertDesc: [''],
      distributionNoDataBoolean: [false],
      distributionNoDataTypeId: [''],
      distributionNoDataUser: [''],
      distributionNoDataDate: [''],
      distributionNoDataPlateB: [''],
      distributionNoDataPlate: [''],
      distributionNoDataPolicy: [''],
      distributionNoDataEffDate: [''],
      distributionNoDataExpDate: [''],
      distributionNoDataName: [''],
      distributionNoDataCarBrand: [''],
      distributionNoDataBroker: [''],
      distributionNoDataRemarks: [''],
      clientId: [''],
      policyNumber: [''],
      policyId: [''],
      productsType: [''],
      brokerDesc: [''],
      policyAmendment: [''],
      policyEffectiveDate: [''],
      policyExpiryDate: [''],
      carYear: [''],
      policyCar: [''],
      productsCode: [''],
      carPlate: [''],
      carOwnerFirstName: [''],
      carOwnerFatherName: [''],
      carOwnerFamilyName: [''],
      notificationVisa: [''],
      carDriverFirstName: [''],
      carDriverFatherName: [''],
      carDriverFamilyName: [''],
      carShapeId: [''],
      policyCarId: [''],
      // carPlate:[''],
      // carYear:[''],
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
        'distributionExpTypeUserName',
        'distributionExpTypeDate',
        'distributionLossDistDate',
        'distributionLossDistUser',
        'distributionLossDistUserName',
        'lossTowExpertId',
        'distributionLossDistributionBoolean',
        'lossTowNeedExpertReportBoolean',
        'expertMobilePhone',
        'distributionLossArrivedBoolean',
        'distributionLossArrivedDate',
        'distributionLossArrivedUser',
        'distributionLossArrivedUserName',
        'distributionExpCanceledId',
        'distributionExpCanceledUserName',
        'distributionExpCanceledUser',
        'distributionExpCanceledDate',
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
      const distributionTowArrivedUser = this.form.get(
        'distributionTowArrivedUser'
      );
      const distributionTowArrivedUserName = this.form.get(
        'distributionTowArrivedUserName'
      );
      // console.log(distributionTowArrivedDate?.value);
      if (!distributionTowArrivedDate?.value) {
        distributionTowArrivedDate?.setValue(
          this.datePipe.transform(
            new Date(),
            this.dateFormat('reportDateTimeFormat')
          )
        );
        const user = this.profileService.getUser();
        distributionTowArrivedUser?.setValue(this.userCode);
        distributionTowArrivedUserName?.setValue(this.displayName);
      }

      this.customerSatisfactionDialog('TD');
    } else {
      this.form.get('distributionTowArrivedDate')?.setValue('');
      this.form.get('distributionTowArrivedUser')?.setValue('');
      this.form.get('distributionTowArrivedUserName')?.setValue('');
    }
  }
  lossTowExpertNameValueChangeListener(event: any) {
    console.log('error');
    const lossTowExpertName = this.form.get(
      'lossTowExpertNamePreference'
    )?.value;
    // const lossTowExpertId = this.form
    //   .get('lossTowExpertNamePreferenceId')
    //   ?.setValue(event);

    this.form.get('lossTowExpertId')?.setValue(event);
    // this.form.get('lossTowExpertNamePreferenceById')?.setValue(event);

    // if (lossTowExpertId) {
    //   this.getSupplierFindById(event);
    // } else {
    if (!lossTowExpertName) {
      this.form.get('lossTowExpertId')?.setValue('');
      // this.form.get('lossTowExpertNamePreferenceById')?.setValue('');
      this.form.get('distributionExpExpertId')?.setValue('');
      this.form.get('distributionExpExpertDesc')?.setValue('');
      this.form.get('distributionLossDistributionBoolean')?.setValue(false);
      this.form.get('distributionLossDistDate')?.setValue('');
      this.form.get('distributionLossDistUser')?.setValue('');
      this.form.get('distributionLossDistUserName')?.setValue('');
      this.form.get('distributionLossArrivedBoolean')?.setValue(false);
      this.form.get('distributionLossArrivedDate')?.setValue(null);
      this.form.get('distributionLossArrivedUser')?.setValue('');
      this.form.get('distributionLossArrivedUserName')?.setValue('');
      this.form.get('distributionExpTypeId')?.setValue('');
      this.form.get('distributionExpTypeDate')?.setValue('');
      this.form.get('distributionExpTypeUser')?.setValue('');
      this.form.get('distributionExpTypeUserName')?.setValue('');
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
  notificationMatDamageChange() {
    const {
      notificationContactName,
      lossTowDriverRelationshipId,
      lossTowDriverName,
      lossTowNbrVehInvolved,
      lossTowEreportedById,
      lossTowExpertNamePreference,
    } = this.form.controls;
    // const newValue = (event.target as HTMLInputElement).value;
    const newValue = this.form.get('notificationMatDamageId')?.value;
    // const newValue = this.form.get('notificationMatDamageId')?.value;
    // const oldValue = this.policyData?.notificationMatDamageId;
    // console.log(newValue);
    // console.log(oldValue);
    if (newValue) {
      if (newValue === '6') {
        notificationContactName.disable();
        lossTowDriverRelationshipId.disable();
        lossTowDriverName.disable();
        lossTowNbrVehInvolved.disable();
        // lossTowEreportedById.disable();
        lossTowExpertNamePreference?.disable();
      } else {
        notificationContactName.enable();
        lossTowDriverRelationshipId.enable();
        lossTowDriverName.enable();
        lossTowNbrVehInvolved.enable();
        // lossTowEreportedById.enable();
        lossTowExpertNamePreference?.enable();
      }

      if (newValue === '5' || newValue === '6' || newValue === '10') {
        this.openTowConditions();
      }

      if (newValue === '5') {
        this.form.get('distributionTowNatureId')?.setValue('1');
      } else if (newValue === '6') {
        this.form.get('distributionTowNatureId')?.setValue('2');
      } else if (newValue === '10') {
        this.form.get('distributionTowNatureId')?.setValue('7');
      }

      if (newValue && newValue === '6') {
        this.changeCo = 'Y';
      }
    }
  }
  async saveAction() {
    // console.log(this.form.value);
    if (
      !this.validateDatePair(
        'distributionLossDistDate',
        'distributionLossArrivedDate',
        'Expert Date & Time : Arrived Date is lower than Dispatch Date'
      )
    ) {
      return; // Exit the function if validation fails
    }

    if (
      !this.validateDatePair(
        'distributionTowDistDate',
        'distributionTowArrivedDate',
        'Towing Dispatch : Arrived Date is lower than Dispatch Date'
      )
    ) {
      return; // Exit the function if validation fails
    }

    const lossTowLossDate = this.form.get('lossTowLossDate')?.value;
    const towToTownName = this.form.get('towToTownName')?.value;
    const lossTowNbrVehInvolved = this.form.get('lossTowNbrVehInvolved')?.value;
    const fromTowTownName = this.form.get('fromTowTownName')?.value;
    const lossTowDriverRelationshipId = this.form.get(
      'lossTowDriverRelationshipId'
    )?.value;
    const notificationMatDamageId = this.form.get(
      'notificationMatDamageId'
    )?.value;

    if (!lossTowLossDate) {
      return this.alertifyService.error('Loss Date is Required');
    }
    if (!lossTowNbrVehInvolved) {
      return this.alertifyService.error('Involved Vehicles is Required');
    }
    if (!lossTowDriverRelationshipId) {
      return this.alertifyService.error('Relation Driver To Owner is Required');
    }
    if (
      !fromTowTownName &&
      (notificationMatDamageId === '6' ||
        notificationMatDamageId === '5' ||
        notificationMatDamageId === '10')
    ) {
      return this.alertifyService.error('From City is Required');
    }

    if (
      !towToTownName &&
      (notificationMatDamageId === '6' ||
        notificationMatDamageId === '5' ||
        notificationMatDamageId === '10')
    ) {
      return this.alertifyService.error('To City is Required');
    }

    const formValues = this.form.getRawValue();

    const extractedValues: NotificationRequest =
      this.formatNotificationData(formValues);

    if (this.changeCo === 'Y') {
      const notificationId = this.form.get('notificationId')?.value;
      const iVehCount = this.form.get('lossTowNbrVehInvolved')?.value;
      const iCo = this.form.get('lossTowStaffCaseMngr');
      // console.log(iVehCount);
      const presultdouble1 = await lastValueFrom(
        this.getFcGetCo(notificationId, iVehCount!, iCo?.value)
      ); // Convert Observable to Promise and await the result
      if (presultdouble1) {
        iCo?.patchValue(presultdouble1);
        // Update extractedValues with the new value of iCo
        extractedValues.lossTowStaffCaseMngr = presultdouble1;
      }
      this.updateLossTowStaffCaseMngr(notificationId, presultdouble1!);
      this.changeCo = 'N';
    }

    await this.dataService.mergeNotification(extractedValues).subscribe({
      next: (res) => {
        this.alertifyService.success(res.message);
        this.getPolicyCarByNotificationId(this.notificationId).then(
          (policyData) => {
            if (policyData) {
              if (policyData.policyExpired === 'Y') {
                this.alertifyService.dialogAlert('Policy expired', 'Expired');
              }
              if (policyData.policyDeleted === 'Y') {
                this.alertifyService.dialogAlert('Policy deleted', 'Deleted');
              }
            }
          }
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
    await this.getFcDoubleToCheck().subscribe((presultdouble) => {
      if (presultdouble === 'NODOUBLE') {
        // Handle the case where there are no doubles.
      } else {
        const notiList: string[] = presultdouble.split(' ');
        const observables: Observable<string>[] = [];

        for (const noti of notiList) {
          if (noti) {
            observables.push(this.getDoubleCheckDataByNotification(noti));
          }
        }

        if (observables.length > 0) {
          forkJoin(observables).subscribe((results) => {
            const dataDisplay: string[] = [];

            for (const res of results) {
              if (res) {
                dataDisplay.push(res);
              }
            }

            if (dataDisplay.length > 0) {
              // Concatenate and display both visa numbers in the same pop-up.
              const combinedData = dataDisplay.join('<br>');
              // console.log(combinedData);
              this.alertifyService.dialogAlert(combinedData, 'Check Double');
            }
          });
        }
      }
    });

    // Log the extracted values
    // console.log(extractedValues);
  }

  getDoubleCheckDataByNotification(noti: string): Observable<string> {
    // const notificationId = this.form.get('notificationId')?.value;
    if (noti) {
      return this.dataService.getDoubleCheckDataByNotification(noti).pipe(
        map((data) => {
          // console.log(data.data[0]);
          return data.data[0];
        }),
        catchError((err) => {
          console.log(err);
          throw err; // You can handle errors further up the call chain if needed.
        })
      );
    } else {
      return of();
    }
  }
  updateLossTowStaffCaseMngr(notificationId: string, user: string) {
    this.dataService
      .updateLossTowStaffCaseMngr(notificationId, user)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getFcGetCo(
    notificationId: string,
    iVehCount: number,
    iCo: string
  ): Observable<string> {
    return this.dataService.getFcGetCo(notificationId, iVehCount, iCo).pipe(
      map((res) => {
        // this.presultdouble1 = res.data;
        // console.log(res);
        return res.data;
      }),
      catchError((err) => {
        console.log(err);
        throw err; // You can handle errors further up the call chain if needed.
      })
    );
  }

  validateDatePair(
    startDateControlName: string,
    endDateControlName: string,
    errorMessage: string
  ) {
    const startDate = this.form.get(startDateControlName)?.value;
    const endDate = this.form.get(endDateControlName)?.value;
    if (startDate && endDate) {
      const format = 'DD/MM/YYYY hh:mm A';
      const startMoment = moment(startDate, format);
      const endMoment = moment(endDate, format);
      if (endMoment.isBefore(startMoment)) {
        this.alertifyService.dialogAlert(errorMessage, 'Error');
        return false; // Validation failed, return false
      }
    }
    return true; // Validation succeeded
  }

  getFcDoubleToCheck(): Observable<string> {
    const notificationId = this.form.get('notificationId')?.value;
    const ipolcarid = this.policyData?.carId!;
    const lossDate = this.form.get('notificationReportedDate')?.value;

    const notificationReportedDate = this.form.get('notificationReportedDate')
      ?.value
      ? moment(lossDate, 'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD HH:mm')
      : '';

    return this.dataService
      .getFcDoubleToCheck(notificationId, ipolcarid, notificationReportedDate)
      .pipe(
        map((res) => {
          // console.log(res.data.presultdouble);
          return res.data.presultdouble;
        })
      );
  }
  private formatNotificationData(formValues: any): NotificationRequest {
    const formattedData: NotificationRequest = {
      notificationId: formValues.notificationId,
      lossTowLossDate: this.formatDate(formValues.lossTowLossDate),
      notificationReportedDate: this.formatDate(
        formValues.notificationReportedDate
      ),
      lossTowEreportedById: formValues.lossTowEreportedById,
      lossTowReportedById: formValues.lossTowReportedById,
      lossTowStaffCaseMngr: formValues.lossTowStaffCaseMngr,
      distributionTowDistUser: formValues.distributionTowDistUser,
      notificationContactName: formValues.notificationContactName,
      carOwnerFirstName: formValues.carOwnerFirstName,
      carOwnerFatherName: formValues.carOwnerFatherName,
      carOwnerFamilyName: formValues.carOwnerFamilyName,
      carDriverFirstName: formValues.carDriverFirstName,
      carDriverFatherName: formValues.carDriverFatherName,
      carDriverFamilyName: formValues.CarDriverFamilyName,
      carShapeId: formValues.carShapeId,
      carPlate: formValues.carPlate,
      carYear: formValues.carYear,
      policyCarId: formValues.policyCarId,
      lossTowDriverRelationshipId: formValues.lossTowDriverRelationshipId,
      lossTowDriverName: formValues.lossTowDriverName,
      notificationContactPhone: formValues.notificationContactPhone,
      lossTowNbrVehInvolved: formValues.lossTowNbrVehInvolved,
      notificationMatDamageId: formValues.notificationMatDamageId,
      distributionNoDataTypeId: formValues.distributionNoDataTypeId,
      carRespReasonCode: formValues.carRespReasonCode,
      distributionExpCanceledId: formValues.distributionExpCanceledId,
      distributionExpCanceledUser: formValues.distributionExpCanceledUser,
      distributionExpCanceledDate: formValues.distributionExpCanceledDate,
      lossTowSeverity: formValues.lossTowSeverity,
      lossTowBodilyCaseId: formValues.lossTowBodilyCaseId,
      distributionExpTypeId: formValues.distributionExpTypeId,
      lossTow2ndExpertId: formValues.lossTow2ndExpertId,
      distributionLossDistributionBoolean:
        formValues.distributionLossDistributionBoolean,
      policyId: formValues.policyId,

      distributionLossDistUser: formValues.distributionLossDistUser,
      distributionLossArrivedBoolean: formValues.distributionLossArrivedBoolean,
      distributionLossArrivedDate: formValues.distributionLossArrivedDate,
      distributionLossArrivedUser: formValues.distributionLossArrivedUser,
      distributionTownId: formValues.distributionTownId,
      distributionExpExpertId: formValues.distributionExpExpertId,
      distributionExpTypeDate: formValues.distributionExpTypeDate,
      distributionExpTypeUser: formValues.distributionExpTypeUser,
      lossTowExpertId: formValues.lossTowExpertId,
      lossTowExpertMan: formValues.lossTowExpertMan,
      lossTowExpertRot: formValues.lossTowExpertRot,
      distributionTema: formValues.distributionTema,
      // lossTowExpertNamePreferenceById:
      //   formValues.lossTowExpertNamePreferenceById,
      distributionTowNatureId: formValues.distributionTowNatureId,
      lossTowRsDesc: formValues.lossTowRsDesc,
      towFromTownId: formValues.towFromTownId,
      towToTownId: formValues.towToTownId,
      distributionTowDistDateBoolean: formValues.distributionTowDistDateBoolean,
      distributionTowDistDate: formValues.distributionTowDistDate,
      distributionTowArrivedUser: formValues.distributionTowArrivedUser,
      distributionTowArrivedDateBoolean:
        formValues.distributionTowArrivedDateBoolean,
      distributionTowArrivedDate: formValues.distributionTowArrivedDate,
      distributionTowDriverName: formValues.distributionTowDriverName,
      distributionTowDriverPhone: formValues.distributionTowDriverPhone,
      distributionTowCanceledId: formValues.distributionTowCanceledId,
      distributionTowDelayId: formValues.distributionTowDelayId,
      distributionTowDelayOther: formValues.distributionTowDelayOther,
      distributionTowDistLifterId: formValues.distributionTowDistLifterId,
      distributionTowTotalKm: formValues.distributionTowTotalKm,
      distributionTowExtraKm: formValues.distributionTowExtraKm,
      distributionTowClientCost: formValues.distributionTowClientCost,
      distributionTowTotalCost: formValues.distributionTowTotalCost,
      totaleDurationBetweenTown: formValues.totaleDurationBetweenTown,
      lossTowBlockedId: formValues.lossTowBlockedId,
      lossTowWheelId: formValues.lossTowWheelId,
      lossTowPickUpId: formValues.lossTowPickUpId,
      lossTowOffRoadId: formValues.lossTowOffRoadId,
      lossTowCarryingGoodId: formValues.lossTowCarryingGoodId,
      lossTowLifterId: formValues.lossTowLifterId,
      distributionLossDistDate: formValues.distributionLossDistDate,
      towingComId: formValues.towingComId,
      lossTowRsId: formValues.lossTowRsId,
      distributionNoDataBoolean: formValues.distributionNoDataBoolean,
      distributionNoDataBroker: formValues.distributionNoDataBroker,
      distributionNoDataCarBrand: formValues.distributionNoDataCarBrand,
      distributionNoDataDate: formValues.distributionNoDataDate,
      distributionNoDataEffDate: formValues.distributionNoDataEffDate,
      distributionNoDataExpDate: formValues.distributionNoDataExpDate,
      distributionNoDataName: formValues.distributionNoDataName,
      distributionNoDataPlate: formValues.distributionNoDataPlate,
      distributionNoDataPlateB: formValues.distributionNoDataPlateB,
      distributionNoDataPolicy: formValues.distributionNoDataPolicy,
      distributionNoDataRemarks: formValues.distributionNoDataRemarks,
      distributionNoDataUser: formValues.distributionNoDataUser,
    };
    return formattedData;
  }
  private formatDate(date: any): string {
    return this.isDateFormatted(date) ? date : this.formatDateTime(date);
  }
  private isDateFormatted(dateTime: any) {
    return (
      typeof dateTime === 'string' && this.dateFormat('reportDateTimeFormat')
    );
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
    const distributionExpCanceledUserNameControl = this.form.get(
      'distributionExpCanceledUserName'
    )!;
    const distributionExpCanceledDateControl = this.form.get(
      'distributionExpCanceledDate'
    );
    const user = this.profile.userCode;
    // Check if controls exist before setting their values
    if (
      distributionExpCanceledUserControl &&
      distributionExpCanceledDateControl
    ) {
      distributionExpCanceledUserControl.setValue(this.userCode);
      distributionExpCanceledUserNameControl.setValue(this.displayName);
      const currentDate = new Date();
      const date = this.datePipe.transform(
        currentDate,
        this.dateFormat('reportDateTimeFormat')
      );

      distributionExpCanceledDateControl.setValue(date);
    }
  }
  // onNotificationMatDamageChange() {
  //   const {
  //     notificationContactName,
  //     lossTowDriverRelationshipId,
  //     lossTowDriverName,
  //     lossTowNbrVehInvolved,
  //     lossTowEreportedById,
  //     lossTowExpertNamePreference,
  //   } = this.form.controls;
  //   this.form.get('notificationMatDamageId')?.valueChanges.subscribe((data) => {

  //   });
  // }
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
      distributionExpCanceledDate,
      // distributionLossArrived,
    } = this.form.controls;
    if (distributionExpCanceledDate) {
      const dateFormat = distributionExpCanceledDate.value;
      const formattedDate = this.datePipe.transform(
        dateFormat,
        this.dateFormat('reportDateTimeFormat')
      );
      distributionExpCanceledDate.setValue(formattedDate);
    }

    const ccSystemAdmin = this.hasPerm('ccSystemAdmin');
    const ccManager = this.hasPerm('ccManager');

    const formControlsToDisable = [
      'distributionTownDescription',
      'distributionExpCanceledUserName',
      'distributionExpCanceledDate',
      'distributionLossDistributionBoolean',
      'distributionLossDistDate',
      'distributionLossDistUserName',
      'distributionLossArrivedUserName',
      'distributionLossArrivedDate',
      'distributionLossArrivedUser',
      'distributionExpTypeId',
      'expertMobilePhone',
      'distributionExpExpertDesc',
      'distributionExpTypeDate',
      'distributionExpTypeUserName',
      'delayedDispatchTime',
      'distributionTema',
      'lossTow2ndExpertName',
      'lossTowRsDesc',
      'towFromTownDescription',
      'towToTownDescription',
      'distributionTowDistDateBoolean',
      'distributionTowDistDate',
      'distributionTowArrivedUserName',
      'delayedTowingTime',
      'distributionTowArrivedDate',
      'distributionTowTotalKm',
      'distributionTowExtraKm',
      'distributionTowClientCost',
      'totaleDurationBetweenTown',
      'towingComDesc',
      'distributionTowDistUserName',
      'lossTowExpert',
      'lossTowExpertNamePreference',
      // Add other control names here
    ];
    for (const controlName of formControlsToDisable) {
      const control = this.form.get(controlName);
      if (control) {
        control.disable();
      }
    }
    // Constants for policy data
    const {
      notificationStatusCode,
      reportedDay,
      // notificationMatDamageId: policyMatDamageId,
    } = this.policyData!;

    // Disable controls based on conditions
    sysCreatedBy?.disable();
    carSelfSurveyUrl?.disable();

    if (!ccSystemAdmin) {
      notificationReportedDate?.disable();
    }

    if (
      (notificationStatusCode !== '0' && reportedDay !== 0) ||
      !ccManager ||
      !ccSystemAdmin
    ) {
      notificationMatDamageId.disable();
      lossTowLossDate.disable();
    }

    if (notificationMatDamageId.value === '6') {
      // notificationMatDamageId?.disable();
      notificationContactName?.disable();
      lossTowDriverRelationshipId?.disable();
      lossTowDriverName?.disable();
      lossTowNbrVehInvolved?.disable();
    }
    if (lossTowReportedById?.value !== '6') {
      lossTowEreportedById?.disable();
    }
    this.form
      .get('lossTowReportedById')
      ?.valueChanges.subscribe((lossTowReportedBy) => {
        if (lossTowReportedBy !== '6') {
          lossTowEreportedById?.disable();
          lossTowEreportedById.setValue('');
        } else {
          lossTowEreportedById?.enable();
        }
      });

    if (lossTowExpertNamePreference?.value === ' ') {
      lossTowExpertNamePreference?.disable();
    } else {
      lossTowExpertNamePreference?.enable();
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
  private formatDateTime(dateTime: any) {
    if (dateTime) {
      const date = new Date(dateTime);
      // console.log(date);
      return this.datePipe.transform(
        date,
        this.dateFormat('reportDateTimeFormat')
      )!;
    } else {
      return null;
    }
  }
  onDistributionTowArived() {
    const distributionLossArrivedBoolean = this.form.get(
      'distributionLossArrivedBoolean'
    )?.value;
    const user = this.profileService.getUser();
    this.form
      .get('distributionLossArrivedDate')
      ?.setValue(
        this.datePipe.transform(
          new Date(),
          this.dateFormat('reportDateTimeFormat')
        )
      );
    this.form.get('distributionLossArrivedUser')?.setValue(this.userCode);
    this.form
      .get('distributionLossArrivedUserName')
      ?.setValue(this.displayName);

    if (distributionLossArrivedBoolean) {
      this.customerSatisfactionDialog('ED');
    } else {
      this.form.get('distributionLossArrivedDate')?.setValue(null);
      this.form.get('distributionLossArrivedUser')?.setValue(null);
      this.form.get('distributionLossArrivedUserName')?.setValue(null);
    }
  }
  private patchFormWithPolicyData(): void {
    if (this.policyData) {
      const lossDate = this.formatDateTime(this.policyData.lossTowLossDate);
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
      const sysCreatedBy =
        this.policyData?.carsContactsPhoneList?.[0]?.sysCreatedBy;

      const distributionTowDistDate = this.formatDateTime(
        this.policyData?.distributionTowDistDate!
      );
      const distributionNoDataEffDate = this.formatDateTime(
        this.policyData?.distributionNoDataEffDate!
      );
      const distributionNoDataExpDate = this.formatDateTime(
        this.policyData?.distributionNoDataExpDate!
      );

      const distributionTowArrivedDate = this.formatDateTime(
        this.policyData?.distributionTowArrivedDate!
      );
      const distributionNoDataDate = this.formatDateTime(
        this.policyData?.distributionNoDataDate!
      );
      this.carsDispatchFollowUpList = this.policyData?.carsDispatchFollowUpList;

      if (this.disableLossDate()) {
        this.form.get('distributionLossDistDate')?.disable();
      }
      this.lossCarId = this.policyData?.lossCarId;
      const lossTowExpertId = this.policyData?.lossTowExpertId;

      this.form.patchValue({
        ...this.policyData,
        lossTowLossDate: lossDate,
        notificationReportedDate: reportedDate,
        distributionLossDistDate: lossDistDate,
        distributionLossArrivedDate: arrivedDate,
        distributionExpTypeDate: distributionExpTypeDate,
        sysCreatedBy: sysCreatedBy,
        distributionTowDistDate: distributionTowDistDate,
        distributionTowArrivedDate: distributionTowArrivedDate,
        lossTowExpertNamePreferenceById: lossTowExpertId,
        distributionNoDataEffDate: distributionNoDataEffDate,
        distributionNoDataExpDate: distributionNoDataExpDate,
        distributionNoDataDate: distributionNoDataDate,
      });
    }
    this.isSystemAdmin();
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
  disableIcons() {
    const notificationStatusCode = this.policyData?.notificationStatusCode;
    // const distributionTownNameBind = this.policyData?.distributionTownNameBind;
    const hasSystemAdminPermission = this.hasPerm('ccSystemAdmin');
    const distributionTownNameBind = this.form.get(
      'distributionTownName'
    )?.value;
    // Disable if any of the following conditions are met
    return (
      !distributionTownNameBind ||
      notificationStatusCode === '8' ||
      notificationStatusCode === '9' ||
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
      distributionExpTypeId === 'X' ||
      distributionTownNameBind === null ||
      notificationStatusCode === '8' ||
      notificationStatusCode === '9' ||
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
    // console.log(this.DisableIcons());
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
  ): Promise<Policy | null> {
    try {
      const res = await lastValueFrom(
        this.dataService.getPolicyCarByNotificationId(notificationId)
      );

      const policyData = res?.data;
      this.policyData = policyData;
      this.patchFormWithPolicyData();
      this.configList();
      return policyData; // Return the policy data
    } catch (err) {
      console.error(err);
      return null; // Handle errors and return null or an appropriate value
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
    if (this.policyData) {
      const dialogData = this.dialog.open(CreateNoDataDialogComponent, {
        data: {
          distributionNoDataBoolean: this.form.get('distributionNoDataBoolean')
            ?.value,
          distributionNoDataBroker: this.form.get('distributionNoDataBroker')
            ?.value,
          distributionNoDataCarBrand: this.form.get(
            'distributionNoDataCarBrand'
          )?.value,
          distributionNoDataDate: this.form.get('distributionNoDataDate')
            ?.value,
          distributionNoDataEffDate: this.formatDate(
            this.form.get('distributionNoDataEffDate')?.value
          ),
          distributionNoDataExpDate: this.form.get('distributionNoDataExpDate')
            ?.value,
          distributionNoDataName: this.form.get('distributionNoDataName')
            ?.value,
          distributionNoDataPlate: this.form.get('distributionNoDataPlate')
            ?.value,
          distributionNoDataPlateB: this.form.get('distributionNoDataPlateB')
            ?.value,
          distributionNoDataPolicy: this.form.get('distributionNoDataPolicy')
            ?.value,
          distributionNoDataRemarks: this.form.get('distributionNoDataRemarks')
            ?.value,
          distributionNoDataUser: this.form.get('distributionNoDataUser')
            ?.value,
          distributionNoDataTypeId: this.form.get('distributionNoDataTypeId')
            ?.value,
          displayname: this.displayName,
          userCode: this.userCode,
          lossTowLossDate: this.form.get('lossTowLossDate')?.value,
        },
        width: '780px',
        height: '550px',
      });
      dialogData.afterClosed().subscribe((data) => {
        if (data) {
          this.form.patchValue(data);
          // this.formData = data;
          // console.log(data);
        }
      });
    }
  }
  changeToAvaiDataDialog() {
    // Destructure the relevant properties from this.policyData
    const { insuranceId, lossTowLossDate } = this.policyData || {};

    const dialogData = {
      notificationId: this.notificationId,
      policyEffectiveDate: this.policyData?.policyEffectiveDate,

      insuranceId,
      lossTowLossDate,
      distributionNoDataBroker: this.form.get('distributionNoDataBroker')
        ?.value,
      distributionNoDataCarBrand: this.form.get('distributionNoDataCarBrand')
        ?.value,
      distributionNoDataDate: this.form.get('distributionNoDataDate')?.value,
      distributionNoDataEffDate: this.formatDate(
        this.form.get('distributionNoDataEffDate')?.value
      ),
      distributionNoDataExpDate: this.form.get('distributionNoDataExpDate')
        ?.value,
      distributionNoDataName: this.form.get('distributionNoDataName')?.value,
      distributionNoDataPlate: this.form.get('distributionNoDataPlate')?.value,
      distributionNoDataPlateB: this.form.get('distributionNoDataPlateB')
        ?.value,
      distributionNoDataPolicy: this.form.get('distributionNoDataPolicy')
        ?.value,
      distributionNoDataRemarks: this.form.get('distributionNoDataRemarks')
        ?.value,
      distributionNoDataUser: this.form.get('distributionNoDataUser')?.value,
      distributionNoDataTypeId: this.form.get('distributionNoDataTypeId')
        ?.value,
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

    dialogRef.afterClosed().subscribe(async (data) => {
      // Update this.changeAvailableData only if data is not null or undefined
      if (data) {
        // this.changeAvailableData = data;
        this.form.get('carOwnerFirstName')?.setValue(data.clientFirstname);
        this.form.get('carOwnerFatherName')?.setValue(data.clientFatherName);
        this.form.get('carOwnerFamilyName')?.setValue(data.clientLastname);
        const counter = await this.getCountExistingDataEntry();
        const distributionNoData = this.form.get(
          'distributionNoDataBoolean'
        )?.value;
        if (distributionNoData == true && counter == 0) {
          this.form.get('carDriverFirstName')?.setValue(data.clientFirstname);
          this.form.get('carDriverFatherName')?.setValue(data.clientFatherName);
          this.form.get('carDriverFamilyName')?.setValue(data.clientLastname);
        }
        if (distributionNoData == true) {
          this.form.get('distributionNoDataBoolean')?.setValue(false);
        }
        this.form.get('carShapeId')?.setValue(data.carShapeId);
        this.form.get('carPlate')?.setValue(data.carPlate);
        this.form.get('carYear')?.setValue(data.carYear);
        this.form.get('policyCarId')?.setValue(data.policyCarId);

        // console.log(counter);
        this.form.patchValue(data);
        // console.log(data);
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
  async getCountExistingDataEntry(): Promise<number> {
    const notificationVisa = this.form.get('notificationVisa')?.value;
    const res = await lastValueFrom(
      this.dataService.getCountExistingDataEntry(notificationVisa)
    );
    return res.data;
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
    // const townName = this.form.get('fromTowTownName')?.value;
    // const townId = this.form.get('fromTowTownId')?.value;
    const townIdControl = this.form.get('towFromTownId');
    const townNameControl = this.form.get('fromTowTownName');
    const town = townIdControl?.value;
    const townName = townNameControl?.value;
    if (!townName) {
      townIdControl?.patchValue('');
    } else {
      townIdControl?.setValue(event);
    }
    // console.log(event);
    if (!event) {
      this.form.get('towFromTownDescription')?.setValue('');
    } else {
      this.dataService.getTownFindById(event).subscribe({
        next: (res) => {
          const data = res.data;
          const distributionTownDescriptionControl = this.form.get(
            'distributionTownDescription'
          );
          distributionTownDescriptionControl?.setValue(
            `${data.cazaDescription} ${data.regionDescription}`
          );
          // this.form.get('towFromTownId')?.setValue(event);
        },
      });
    }
  }
  getTowToTownDescription(event: any) {
    // const town2 = this.form.get('towToTownName')?.value;
    const townIdControl = this.form.get('towToTownId');
    const townNameControl = this.form.get('towToTownName');
    const townName = townNameControl?.value;
    if (!townName) {
      townIdControl?.patchValue('');
    } else {
      townIdControl?.setValue(event);
    }
    if (!event) {
      this.form.get('towToTownDescription')?.setValue('');
    } else {
      this.dataService.getTownFindById(event).subscribe({
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
    const {
      distributionTownId,
      distributionTownName,
      distributionTownDescription,
      notificationMatDamageId,
      fromTowTownName,
      towFromTownId,
    } = this.form.controls;

    const town = distributionTownId?.value;
    const townName = distributionTownName?.value;

    if (!townName) {
      distributionTownId?.patchValue('');
    } else {
      distributionTownId?.setValue(event);
    }

    if (!event) {
      distributionTownDescription?.setValue('');
    }

    if (event) {
      this.dataService.getTownFindById(event).subscribe({
        next: (res) => {
          const data = res.data;

          distributionTownDescription?.setValue(
            `${data.cazaDescription} ${data.regionDescription}`
          );

          if (
            notificationMatDamageId?.value === '5' ||
            notificationMatDamageId?.value === '10'
          ) {
            fromTowTownName?.setValue(data.townName);
            towFromTownId?.setValue(data.townId);
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
        console.log(data);
        if (data) {
          this.form.get('distributionExpTypeId')?.setValue('1');
          this.form.get('distributionExpTypeUser')?.setValue(this.userCode);
          this.form.get('expertMobilePhone')?.setValue(data.expertMobilePhone);
          this.form
            .get('distributionExpTypeUserName')
            ?.setValue(this.displayName);
          this.form
            .get('distributionExpTypeDate')
            ?.setValue(
              this.datePipe.transform(
                new Date(),
                this.dateFormat('reportDateTimeFormat')
              )
            );
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
          this.form.get('distributionExpCanceledUserName')?.setValue(null);
          this.form.get('distributionExpCanceledDate')?.setValue(null);
          const notificationReportedDate =
            this.policyData?.notificationReportedDate!;
          this.calculateDelay(notificationReportedDate);
          if (data.direction === 'Direct') {
            this.form
              .get('distributionLossArrivedDate')
              ?.setValue(
                this.datePipe.transform(
                  new Date(),
                  this.dateFormat('reportDateTimeFormat')
                )
              );
            this.form
              .get('distributionLossArrivedUser')
              ?.setValue(this.userCode);
            this.form
              .get('distributionLossArrivedUserName')
              ?.setValue(this.displayName);

            this.form.get('distributionLossArrivedBoolean')?.setValue(true);
            this.form
              .get('distributionLossDistDate')
              ?.setValue(
                this.datePipe.transform(
                  new Date(),
                  this.dateFormat('reportDateTimeFormat')
                )
              );
            this.form.get('distributionLossDistUser')?.setValue(this.userCode);
            this.form
              .get('distributionLossDistUserName')
              ?.setValue(this.displayName);
            this.form.get('distributionTema')?.setValue('N');
            this.form
              .get('distributionLossDistributionBoolean')
              ?.setValue(true);
          } else {
            this.form
              .get('distributionLossDistDate')
              ?.setValue(
                this.datePipe.transform(
                  new Date(),
                  this.dateFormat('reportDateTimeFormat')
                )
              );
            this.form.get('distributionLossDistUser')?.setValue(this.userCode);
            this.form
              .get('distributionLossDistUserName')
              ?.setValue(this.displayName);

            this.form.get('distributionTema')?.setValue('N');
            this.form
              .get('distributionLossDistributionBoolean')
              ?.setValue(true);
            this.form.get('distributionLossArrivedDate')?.setValue(null);
            this.form.get('distributionLossArrivedUser')?.setValue(null);
            this.form.get('distributionLossArrivedUserName')?.setValue(null);
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
          this.form.get('lossTow2ndExpertName')?.setValue(data.experName);
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
    const natureId = this.form.get('distributionTowNatureId')?.value;

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
      distributionTowDistDateControl?.setValue(this.formatDateTime(new Date()));

      const distributionTowDistUserControl = this.form.get(
        'distributionTowDistUser'
      );
      const distributionTowDistUserNameControl = this.form.get(
        'distributionTowDistUserName'
      );
      distributionTowDistUserControl?.setValue(this.userCode);
      distributionTowDistUserNameControl?.setValue(this.displayName);

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
    const reported = new Date(reportedDate);

    const localDateTime = {
      year: reported.getFullYear(),
      month: reported.getMonth() + 1, // Months are 0-indexed in JavaScript
      dayOfMonth: reported.getDate(),
      hour: reported.getHours(),
      minute: reported.getMinutes(),
    };

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
  calculateTowingKmAndCost() {
    const towingCompany = this.policyData?.towingCompanyList;
    this.milageAcc = null;
    this.milageMech = null;
    this.milagePrivate = null;
    this.milagePublic = null;
    this.clientCost = null;
    this.isPublic = false;
    const carPlate1 = this.policyData?.carPlate;
    if (carPlate1 && carPlate1.includes('M')) {
      this.isPublic = true;
    }
    if (towingCompany && towingCompany.length > 0) {
      const towingConditionList = towingCompany[0].towingConditionList;
      if (
        towingCompany &&
        towingCompany.length > 0 &&
        towingCompany[0].towingConditionList.length > 0 &&
        towingCompany[0].towingConditionList[0] != null
      ) {
      }
    }
  }
  openDispatchExpertDialog() {
    // this.showrelated = 'Y';
    if (this.policyData) {
      const dialogRef = this.dialog.open(ExpertDispatchComponent, {
        data: {
          insuranceId: this.policyData?.insuranceId,
          insuranceDesc: this.policyData?.insuranceDesc,
          distributionTownId: this.form.get('distributionTownId')?.value,
          notificationMatDamageId: this.form.get('notificationMatDamageId')
            ?.value,
          notificationReportedDate: this.form.get('notificationReportedDate')
            ?.value,
          notificationId: this.form.get('notificationId')?.value,
          townTerritoryList: this.policyData?.townTerritoryList,
          telExtension: this.telExtension,
          showTelIcon: this.showTelIcon,
          lossTowId: this.policyData?.lossTowId,
          notificationVisa: this.policyData?.notificationVisa,
        },
        width: '800px',
        height: '500px',
      });

      dialogRef.afterClosed().subscribe((data) => {
        // this.getPolicyCarByNotificationId(this.notificationId!);
        if (data) {
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

          if (data.createRelated) {
            console.log(data);
            // const distributionExpExpertId = this.form.get(
            //   'distributionExpExpertId'
            // )?.value;
            // const distributionExpExpertDesc = this.form.get(
            //   'distributionExpExpertDesc'
            // )?.value;
            // const lossTowExpertId = this.form.get('lossTowExpertId')?.value;
            // const lossTowExpertNamePreference = this.form.get(
            //   'lossTowExpertNamePreference'
            // )?.value;
            this.form
              .get('distributionExpExpertId')
              ?.setValue(data.lossTowExpertId);
            this.form
              .get('distributionExpExpertDesc')
              ?.setValue(data.expertName);
            this.form.get('distributionExpTypeId')?.setValue('R');
            this.form.get('distributionExpTypeUser')?.setValue(this.userCode);
            this.form
              .get('distributionExpTypeUserName')
              ?.setValue(this.displayName);
            this.form
              .get('distributionExpTypeDate')
              ?.setValue(
                this.datePipe.transform(
                  new Date(),
                  this.dateFormat('reportDateTimeFormat')
                )
              );
            this.form.get('distributionLossDistUser')?.setValue(this.userCode);
            this.form
              .get('distributionLossDistUserName')
              ?.setValue(this.displayName);
            this.form
              .get('distributionLossDistDate')
              ?.setValue(
                this.datePipe.transform(
                  new Date(),
                  this.dateFormat('reportDateTimeFormat')
                )
              );
            this.form.get('lossTowExpertId')?.setValue(data.lossTowExpertId);
            this.form
              .get('lossTowExpertNamePreference')
              ?.setValue(data.expertName);
            this.form.get('distributionTema')?.setValue('N');
            this.form
              .get('distributionLossDistributionBoolean')
              ?.setValue(true);
            this.form.get('lossTowNeedExpertReportBoolean')?.setValue(true);
          }
        }
      });
    }
  }
  handleClaimExpertSelection(oclaimExpert: string, oclaimexpertname: string) {
    const userCode = this.profileService.getUser();

    this.form.get('distributionExpExpertId')?.setValue(oclaimExpert);
    this.form.get('distributionExpExpertDesc')?.setValue(oclaimexpertname);
    this.form.get('distributionExpTypeId')?.setValue('X');
    this.form.get('distributionExpTypeUser')?.setValue(this.userCode);
    this.form.get('distributionExpTypeUserName')?.setValue(this.displayName);
    this.form
      .get('distributionExpTypeDate')
      ?.setValue(
        this.datePipe.transform(
          new Date(),
          this.dateFormat('reportDateTimeFormat')
        )
      );
    this.form.get('lossTowExpertId')?.setValue(oclaimExpert);
    this.form
      .get('distributionLossDistDate')
      ?.setValue(
        this.datePipe.transform(
          new Date(),
          this.dateFormat('reportDateTimeFormat')
        )
      );
    this.form.get('distributionLossDistUser')?.setValue(this.userCode);
    this.form.get('distributionLossDistUserName')?.setValue(this.displayName);
    this.form.get('lossTowExpertNamePreference')?.setValue(oclaimexpertname);
    this.form.get('lossTowExpertId')?.setValue(oclaimExpert);
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
    // this.form.get('lossTowExpertNamePreferenceById')?.setValue('');
    this.form.get('distributionExpTypeUser')?.setValue(null);
    this.form.get('distributionExpTypeUserName')?.setValue(null);
    this.form.get('distributionExpTypeDate')?.setValue(null);
    this.form.get('lossTowExpertId')?.setValue(null);
    this.form.get('distributionLossDistDate')?.setValue('');
    this.form.get('distributionLossDistUser')?.setValue(null);
    this.form.get('distributionLossDistUserName')?.setValue(null);
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
          notificationContactName: this.form.get('notificationContactName')
            ?.value,
          notificationContactPhone: this.form.get('notificationContactPhone')
            ?.value,
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
          distributionLossArrivedUser: this.form.get(
            'distributionLossArrivedUser'
          )?.value,
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
            ?.patchValue(this.formatDateTime(data.distributionLossArrivedDate));
          this.form
            .get('distributionLossArrivedUser')
            ?.patchValue(data.distributionLossArrivedUser);
          this.saveAction();
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
    const notificationMatDamageId = this.form.get(
      'notificationMatDamageId'
    )?.value;
    return (
      notificationMatDamageId === '5' ||
      notificationMatDamageId === '6' ||
      notificationMatDamageId === '10'
    );
  }
  shouldShowDistributionTowNatureLink(): boolean {
    const distributionTowNatureId = this.form.get(
      'distributionTowNatureId'
    )?.value;
    return distributionTowNatureId !== null || distributionTowNatureId !== '0';
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
