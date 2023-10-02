import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-new-hotline',
  templateUrl: './new-hotline.component.html',
  styleUrls: ['./new-hotline.component.css'],
})
export class NewHotlineComponent implements OnInit {
  dico?: any;
  notificationId?: string;
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
    private profileService: LoadingServiceService
  ) {}
  async ngOnInit() {
    this.visaForm();
    this.getDico();
    await this.getData();
    this.route.params.subscribe((params) => {
      const notificationId = params['notificationId'];
      // this.notificationId = notificationId;
      this.getPolicyCarByNotificationId(notificationId);
      this.userRolesService.getUserRoles();
      this.getCompaniesPerUser();

      this.getReportedByLovFindAll();
      this.getRelationToOwnerLovFindAll();
      this.getNotificationNatureLovFindAll();
      this.getEReportedByLovFindAll();
      if (this.hasPerm('ccAllowChangeRespReason')) {
        this.carRespReasonCode();
      }
      this.getExpCancelReasonLovFindAll();
      this.getExpertDispatchTypeLovFindAll();
      this.profile = this.profileService.getSelectedProfile();
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
      distributionLossDistDate: [null],
      distributionLossDistUser: [''],
      distributionLossArrivedBoolean: [''],
      distributionLossArrivedDate: [null],
      distributionLossArrivedUser: [''],
      expertMobilePhone: [''],
      distributionTownId: [''],
      distributionExpExpertId: [''],
      distributionExpTypeDate: [null],
      distributionExpTypeUser: [''],
      distributionTownNameBind: [''],
      distributionTown: [''],
      towFromTown: [''],
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
      carsDispatchFollowUp: [''],
    });

    // this.getTownDesc();
  }
  async getData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Call your service here to fetch data
      this.profileService.loginInfo$.subscribe({
        next: (data: any) => {
          const displayName = data?.displayName;
          this.displayName = displayName;
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
  noExpert() {
    if (this.policyData) {
      const controlsToReset = [
        'delayedDispatchTime',
        'distributionExpTypeId',
        'distributionExpExpertId',
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

  // getSupplierFindById(event: any) {
  //   // const expertId = this.form.get('lossTowExpertNamePreferenceById')?.value;
  //   const lossTowExpertNamePreference = this.form.get(
  //     'lossTowExpertNamePreference'
  //   )?.value;

  //   this.dataService.getSupplierFindById(event).subscribe({
  //     next: (result) => {
  //       if (result.data && !result.data.supplierInactd) {
  //         this.form.get('lossTowExpert')?.setValue(result.data);

  //         this.form
  //           .get('lossTowExpertNamePreferenceById')
  //           ?.setValue(lossTowExpertNamePreference);
  //         this.form
  //           .get('lossTowExpertId')
  //           ?.setValue(lossTowExpertNamePreference);
  //       } else {
  //         this.form.get('lossTowExpert')?.setValue(null);
  //         this.form.get('lossTowExpertNamePreferenceById')?.setValue(null);
  //         this.form.get('lossTowExpertId')?.setValue(null);
  //         console.error('No Expert name ');
  //       }

  //       console.log(result.data);
  //     },
  //   });
  // }

  lossTowExpertNameValueChangeListener(event: any) {
    const lossTowExpertId = this.form.get('lossTowExpertNamePreference')?.value;
    // if (lossTowExpertId) {
    //   this.getSupplierFindById(event);
    // } else {
    if (!lossTowExpertId) {
      this.form.get('lossTowExpertId')?.setValue('');
      this.form.get('lossTowExpertNamePreferenceById')?.setValue('');
      this.form.get('distributionExpExpertId')?.setValue('');
      this.form.get('distributionLossDistribution')?.setValue('N');
      this.form.get('distributionLossDistDate')?.setValue('');
      this.form.get('distributionLossDistUser')?.setValue('');
      this.form.get('distributionLossArrived')?.setValue('N');
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
      'distributionTownDescription',
      'distributionExpCanceledUser',
      'distributionExpCanceledDate',
      'distributionLossDistributionBoolean',
      'distributionLossDistDate',
      'distributionLossDistUser',
      'distributionLossArrivedDate',
      'distributionLossArrivedUser',
      'distributionExpTypeId',
      'expertMobilePhone',
      'distributionExpExpertId',
      'distributionExpTypeDate',
      'distributionExpTypeUser',
      'distributionTema',
      // Add other control names as needed
    ];

    disabledControls.forEach((controlName) => {
      this.form.get(controlName)?.enable();
      // const distributionTownId = this.form.get('distributionTownId')?.value;
      // const lossTowExpertId = this.form.get('lossTowExpertId')?.value;
      // this.form.get('distributionTownName')?.setValue(distributionTownId);
      // this.form.get('lossTowExpertNamePreference')?.setValue(lossTowExpertId);
    });

    // Log the form value
    console.log(this.form.value);

    // Disable the form controls again
    disabledControls.forEach((controlName) => {
      this.form.get(controlName)?.disable();
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
    distributionExpExpertId.disable();
    distributionExpTypeDate?.disable();
    distributionExpTypeUser?.disable();
    delayedDispatchTime.disable();
    distributionTema.disable();
    supplierName.disable();
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
    const parsedDate = moment(dateTime, 'DD/MM/yyyy hh:mm A').toDate();
    return this.datePipe.transform(
      dateTime,
      this.dateFormat('reportDateTimeFormat')
    )!;
  }
  onDistributionTowArived() {
    const distributionLossArrivedBoolean = this.form.get(
      'distributionLossArrivedBoolean'
    )?.value;

    if (distributionLossArrivedBoolean) {
      this.customerSatisfactionDialog();
    } else {
      this.form.get('distributionLossArrivedDate')?.setValue(null);
      this.form.get('arrivedUserTowingChoice')?.setValue(null);
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
        this.policyData?.carsContactsPhoneList![0].sysCreatedBy;
      // this.getSupplierFindById();

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
      });
      this.isSystemAdmin();
      // this.getTownById();
    }
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
    const dialogData = this.dialog.open(CreateNoDataDialogComponent, {
      data: {
        formData: this.formData,
      },
      width: '780px',
      height: '550px',
    });
    dialogData.afterClosed().subscribe((data) => {
      this.formData = data;
    });
  }
  changeToAvaiDataDialog() {
    // Destructure the relevant properties from this.policyData
    const {
      distributionNoDataPlateB,
      distributionNoDataPlate,
      distributionNoDataPolicy,
      distributionNoDataName,
      distributionNoDataRemarks,
      distributionNoDataEffDate,
      distributionNoDataExpDate,
      distributionNoDataCarBrand,
      distributionNoDataBroker,
      insuranceId,
      lossTowLossDate,
    } = this.policyData || {};

    // Define the data object more concisely
    const noDataEffDate = this.datePipe.transform(
      distributionNoDataEffDate,
      this.dateFormat('reportDateFormat')
    );
    const noDataExpDate = this.datePipe.transform(
      distributionNoDataExpDate,
      this.dateFormat('reportDateFormat')
    );
    const dialogData = {
      distributionNoDataPlateB,
      distributionNoDataPlate,
      distributionNoDataPolicy,
      distributionNoDataName,
      distributionNoDataRemarks,
      noDataEffDate,
      noDataExpDate,
      distributionNoDataCarBrand,
      distributionNoDataBroker,
      insuranceId,
      lossTowLossDate,
      changeAvailableData: this.changeAvailableData,
      polserno: this.polserno,
      policyData: this.policySearchData,
      companies: this.companies,
    };

    const dialogRef = this.dialog.open(ChangeToAvailableDataComponent, {
      width: '780px',
      height: '550px',
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
  getTownFindById() {
    const town = this.form.get('distributionTownName')?.value;
    if (town) {
      this.dataService.getTownFindById(town).subscribe({
        next: (res) => {
          const data = res.data;

          this.form
            .get('distributionTownDescription')
            ?.setValue(data.cazaDescription + ' ' + data.regionDescription);
          this.form.get('distributionTownNameBind')?.setValue(data.townName);
          this.form.get('distributionTown')?.setValue(data);
          this.form.get('distributionTownId')?.setValue(data.townId);
          this.form.get('distributionTownName')?.setValue(data.townName);

          if (
            this.policyData?.notificationMatDamageId === '5' ||
            this.policyData?.notificationMatDamageId === '10'
          ) {
            this.form.get('towFromTown')?.setValue(data);
            this.form.get('fromTowTownName')?.setValue(data.townName);
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
          this.form.get('distributionExpExpertId')?.setValue(data.supplierName);
          this.form.get('lossTowExpertId')?.setValue(data.supplierId);
          this.form.get('distributionExpCanceledId')?.setValue(null);
          this.form.get('distributionExpCanceledUser')?.setValue(null);
          this.form.get('distributionExpCanceledDate')?.setValue(null);

          this.calculateDelay();
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
  calculateDelay() {
    // Simulate the notificationReportedDate
    const notificationReportedDate = this.policyData?.notificationReportedDate!;
    // console.log(notificationReportedDate);
    // Convert the notificationReportedDate string to a JavaScript Date object
    const reported = new Date(notificationReportedDate);
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
  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  openDispatchExpertDialog() {
    this.showrelated = 'Y';
    const dialog = this.dialog.open(ExpertDispatchComponent, {
      data: {
        insuranceDesc: this.policyData?.insuranceDesc,
      },
      width: '500px',
      height: '500px',
    });
  }
  customerSatisfactionDialog() {
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
          distributionLossArrivedBoolean: this.form.get(
            //check
            'distributionLossArrivedBoolean'
          )?.value,
          distributionLossArrivedDate: this.form.get(
            'distributionLossArrivedDate'
          )?.value,
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
          console.log(data);
        }
      });
    }
  }
}
