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
    });
  }

  visaForm() {
    this.form = this.fb.group({
      lossTowLossDate: ['', Validators.required],
      notificationReportedDate: ['', Validators.required],
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
      distributionExpCanceledDate: [''],
      lossTowSeverity: [''],
      lossTowBodilyCaseId: [''],
      distributionExpTypeId: [''],
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
  onSubmit() {
    console.log(this.form.value);
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

    // Check if controls exist before setting their values
    if (
      distributionExpCanceledUserControl &&
      distributionExpCanceledDateControl
    ) {
      distributionExpCanceledUserControl.setValue(this.displayName);
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
  private formatDateTime(dateTime: string): string {
    return this.datePipe.transform(dateTime, 'dd/MM/yyyy hh:mm:ss')!;
  }
  private patchFormWithPolicyData(): void {
    if (this.policyData) {
      const lossDate = this.formatDateTime(this.policyData?.lossTowLossDate!);
      const reportedDate = this.formatDateTime(
        this.policyData?.notificationReportedDate!
      );
      this.form.patchValue({
        ...this.policyData,
        lossTowLossDate: lossDate,
        notificationReportedDate: reportedDate,
      });
      this.isSystemAdmin();
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
    this.dataService.getAddresses('').subscribe({
      next: (result) => {
        if (getTownCode) {
          const data = result.data?.find(
            (value: any) => value.code === getTownCode
          );
          console.log(data);
          if (data) {
            const description = data.description;
            console.log(description);
            this.form.patchValue({ distributionTownName: description }); // Update the description in the form control
          }
        }
      },
    });
  }

  searchForTerritory(event: any) {
    // const value = this.form.get('distributionTownName')?.value;
    const value = event.term;

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataService.getAddresses(value).subscribe({
        next: (res) => {
          this.territoryValues = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 300);
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
        },
      });
    }
  }

  chooseManuallyDialog() {
    if (this.policyData) {
      this.dialog.open(ChooseManuallyComponent, {
        data: {
          telExtension: this.telExtension,
          showTelIcon: this.showTelIcon,
          insuranceId: this.policyData?.insuranceId,
        },
        width: '1300px',
        height: '700px',
      });
    }
  }
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

  secondExpertDialog() {
    this.dialog.open(SecondExpertDialogComponent, {
      width: '1100px',
      height: '730px',
    });
  }
  customerSatisfactionDialog() {
    this.dialog.open(CustomerSatisfactionDialogComponent, {
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
      },
      width: '1500px',
      height: '600px',
    });
  }
}
