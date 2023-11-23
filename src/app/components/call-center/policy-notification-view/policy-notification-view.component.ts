import { DatePipe } from '@angular/common';
import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
import { Policy } from 'src/app/model/policy';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';
import { CreateNoDataDialogComponent } from '../new-hotline/create-no-data-dialog/create-no-data-dialog.component';

@Component({
  selector: 'app-policy-notification-view',
  templateUrl: './policy-notification-view.component.html',
  styleUrls: ['./policy-notification-view.component.css'],
})
export class PolicyNotificationViewComponent implements OnInit, OnChanges {
  selectedTabIndex: number = 0;
  loadDynamicTab: boolean = false;
  isFlipped: boolean[] = [];
  dico?: any;
  iSearchBy: string = 'PlateNumber';
  policySearch: any[] = [];
  iSearchValue: string = '';
  iAsOfDate: Date = new Date();
  iPolicyType: string = 'ALL_TPL';
  policyTypes: any[] = [];
  insuranceCode: string = 'ALL';
  companies?: any;
  searchPolicyData: any[] = [];
  product: string = '';
  products: any[] = [];
  notificationNature: any[] = [];
  selectedNature: string = '';
  filteredData: any[] = [];
  cmp: string;
  bodilyInjuriesLov: type[] = [];
  notificationNatureLov: type[] = [];
  myForm!: FormGroup;
  private searchTimer: any;
  townNameLov: any[] = [];
  reportedByLov: type[] = [];
  relationToDriver: type[] = [];
  changeSides: boolean = false;
  showMainContainer?: boolean;
  policyAmendment?: string;
  policyCar?: string;
  polserno?: string;
  title?: string;
  expiredMessage?: string;
  deleteMessage?: string;
  canceledMessage?: string;
  mechTowMessage?: string;
  confirmMessage?: string;
  mechTow?: string;
  policyTypeDesc?: string;
  policyExpiryDateFormated?: string;
  requiredFieldsNames?: any[] = [];
  selectedPolicy?: Policy;
  @ViewChild('expiredPop') expiredPop!: TemplateRef<any>;
  @ViewChild('deletedPop') deletedPop!: TemplateRef<any>;
  @ViewChild('canceledPop') canceledPop!: TemplateRef<any>;
  @ViewChild('mechTowPop') mechTowPop!: TemplateRef<any>;
  @ViewChild('blackListPop') blackListPop!: TemplateRef<any>;
  @ViewChild('confirmPop') confirmPop!: TemplateRef<any>;
  @ViewChild('confirmPopUp') confirmPopUp!: TemplateRef<any>;
  private dialogRef!: MatDialogRef<any>;
  requiredFieldsResponse: any[] = [];
  natureLabels: any = {
    '1': 'Accident',
    '5': 'Accident+Towing',
    '2': 'Fire',
    '10': 'Fire+Towing',
    '7': 'Previous Damages',
    '9': 'Recovery',
    '13': 'Tentative Theft',
    '3': 'Theft',
    '6': 'Towing',
    '4': 'Vandalism',
    '12': 'Partial Theft',
  };
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.userRolesService.getUserRoles();
    this.cmp = this.profileService.getCompany()!;
  }
  onDistributionTownIdChanged() {
    const townNameValue = this.myForm.get('distributionTownName')?.value;
    if (this.selectedNature === '5' || this.selectedNature === '10') {
      //TODO check the following from Tow Town Name
      // this.myForm.get('fromTowTownName')?.setValue(townNameValue);
    }
  }
  openExpiredPop(title: string, message: string) {
    this.title = title;
    this.expiredMessage = message;
    this.dialogRef = this.dialog.open(this.expiredPop, {
      data: {
        title,
        message,
      },
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addPolicyNotification();
      }
    });
  }
  async onMechTowPopConfirm() {
    const ccValidateBlackListClient = await lastValueFrom(
      this.getCoreConfigValueByKey('ccValidateBlackListClient')
    );
    if (ccValidateBlackListClient === 'true') {
      this.checkBlackListInOuClient();
    } else {
      this.checkValidations();
    }
  }
  async checkMechTowCount() {
    if (
      this.selectedNature &&
      (this.selectedNature === '5' ||
        this.selectedNature === '6' ||
        this.selectedNature === '10')
    ) {
      if (this.mechTow && Number(this.mechTow) > 2) {
        this.openMechTowPop();
      }
    }

    const ccValidateBlackListClient = await lastValueFrom(
      this.getCoreConfigValueByKey('ccValidateBlackListClient')
    );
    if (ccValidateBlackListClient === 'true') {
      this.checkBlackListInOuClient();
    } else {
      this.checkValidations();
    }
  }
  async checkBlackListInOuClient() {
    const policyClientId: string = this.selectedPolicy?.policyClientId!;
    const policyBrokerId: string = this.selectedPolicy?.policyBrokerId!;
    const carPlate: string = this.selectedPolicy?.carPlate!;
    const policyNumber: string = this.selectedPolicy?.policyNumber!;
    const policyNumStr = null;
    if (policyNumber) {
      let policyNumStr = policyNumber;
    }

    const blackListIn: number = await lastValueFrom(
      this.checkBlackListInOutExist(
        'IN',
        carPlate,
        policyClientId,
        policyBrokerId,
        policyNumStr!
      )
    );
    const blackListOut: number = await lastValueFrom(
      this.checkBlackListInOutExist(
        'OU',
        carPlate,
        policyClientId,
        policyBrokerId,
        policyNumStr!
      )
    );

    if (blackListIn !== blackListOut) {
      this.openBlackListPop();
    }
    this.checkValidations();
  }
  checkBlackListInOutExist(
    type: string,
    plateNum: string,
    clientId: string,
    brokerId: string,
    policyNumStr: string
  ): Observable<number> {
    return this.dataService
      .checkBlackListInOutExist(
        type,
        plateNum,
        clientId,
        brokerId,
        policyNumStr
      )
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError((err) => {
          throw console.error(err);
        })
      );
  }
  openBlackListPop() {
    this.dialogRef = this.dialog.open(this.blackListPop, {
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.checkValidations();
      }
    });
  }
  openCanceledPop(title: string, message: string) {
    this.title = title;
    this.canceledMessage = message;
    this.dialogRef = this.dialog.open(this.canceledPop, {
      data: {
        title,
        message,
      },
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addPolicyNotification();
      }
    });
  }
  openMechTowPop() {
    this.dialogRef = this.dialog.open(this.mechTowPop, {
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.onMechTowPopConfirm();
      }
    });
  }
  openDeletedPop(title: string, message: string) {
    this.title = title;
    this.deleteMessage = message;
    this.dialogRef = this.dialog.open(this.deletedPop, {
      data: {
        title,
        message,
      },
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addPolicyNotification();
      }
    });
  }
  disablePolicyType(): boolean {
    const bodilyInjury = this.myForm.get('lossTowBodilyCaseId')?.value;
    return (
      this.selectedNature === '7' ||
      ((bodilyInjury === '5' ||
        bodilyInjury === '8' ||
        bodilyInjury === '11') &&
        this.cmp !== '10')
    );
  }
  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
  async policyNotificationInit() {
    if (this.cmp && this.cmp !== '1') {
      this.insuranceCode = this.cmp;
    }

    try {
      const lossDateAuto = await lastValueFrom(
        this.getCoreConfigValueByKey('lossDateAuto')
      );
      const reportedByAuto = await lastValueFrom(
        this.getCoreConfigValueByKey('reportedByAuto')
      );
      const policySearchChangeSides = await lastValueFrom(
        this.getCoreConfigValueByKey('policySearchChangeSides')
      );
      policySearchChangeSides
        ? ((this.showMainContainer = true), (this.selectedNature = '1'))
        : this.showMainContainer;
      if (lossDateAuto === 'true') {
        this.myForm.get('lossTowLossDate')?.setValue(new Date());
      }
      if (reportedByAuto === 'true') {
        this.myForm.get('lossTowReportedById')?.setValue('1');
      }
      if (policySearchChangeSides === 'true') {
        this.changeSides = true;
      }
      this.myForm.get('notificationReportedDate')?.setValue(new Date());
      this.getRequiredFields();
    } catch (error) {
      console.error('Error in policyNotificationInit:', error);
    }
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss')!;
  }
  onTabSelected(event: any) {
    this.selectedTabIndex = event.index;

    const selectedCode = this.filteredData[this.selectedTabIndex].code;
    this.selectedNature = selectedCode;
  }
  createForm() {
    this.myForm = this.fb.group({
      lossTowBodilyCaseId: [''],
      distributionTownName: [''],
      fromTowTownName: [''],
      lossTowLossDate: [''],
      notificationReportedDate: [''],
      lossTowReportedById: [''],
      lossTowDriverRelationshipId: [''],
      notificationMatDamageCode: [''],
      lossTowDriverName: [''],
      notificationContactName: [''],
      notificationContactPhone: [''],
      towToTownName: [''],
      policyCarId: [''],
      insurance: [''],
      userCompany: [this.cmp],
      distributionNoDataTypeId: [''],
      distributionNoDataBoolean: [false],
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
    });
  }

  getRequiredFields() {
    this.dataService
      .getPolicyNotiRequiresFieldsByCmp(this.cmp, 'HOTREQ', this.selectedNature)
      .subscribe({
        next: (res) => {
          this.requiredFieldsResponse = res.data;
          const requiredFieldNames = this.requiredFieldsResponse.map(
            (item) => item.val1
          );
          const requiredFieldsName = this.requiredFieldsResponse.map(
            (item) => item.val3
          );
          this.requiredFieldsNames?.push(requiredFieldsName);

          this.setRequiredFields(requiredFieldNames);

          console.log(this.requiredFieldsNames);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  setRequiredFields(fieldNames: string[]) {
    // Create an object with each field set to required or not based on the fieldNames array
    const formControlsConfig: { [key: string]: any } = {};
    Object.keys(this.myForm.controls).forEach((controlName) => {
      formControlsConfig[controlName] = [
        this.myForm.controls[controlName].value,
      ];
      if (fieldNames.includes(controlName)) {
        formControlsConfig[controlName].push(Validators.required);
      }
    });

    // Re-create the form with the updated validation settings
    this.myForm = this.fb.group(formControlsConfig);
  }
  async selectedPolicyNotification(selectedPolicy: any) {
    if (!this.myForm.valid) {
      return this.alertifyService.error(
        this.requiredFieldsNames + 'are missing.'
      );
    }
    this.myForm.get('policyCarId')?.setValue(selectedPolicy.carId);
    this.selectedPolicy = selectedPolicy;
    this.mechTow = selectedPolicy.mechanicalTowCount;
    this.policyTypeDesc = selectedPolicy.policyTypeDesc;

    // const lossTowLossDate = this.formatDate(
    //   this.myForm.get('lossTowLossDate')?.value
    // );
    const formatDate = moment(
      selectedPolicy.policyExpiryDate,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('DD-MMM-YYYY');

    this.policyExpiryDateFormated = formatDate;

    const confirmMessageOnPolicyNotification = await lastValueFrom(
      this.getCoreConfigValueByKey('confirmMessageOnPolicyNotification')
    );
    const validateMechTow = await lastValueFrom(
      this.getCoreConfigValueByKey('validateMechTow')
    );
    const ccValidateBlackListClient = await lastValueFrom(
      this.getCoreConfigValueByKey('ccValidateBlackListClient')
    );
    try {
      if (confirmMessageOnPolicyNotification === 'true') {
        this.openConfirmPopUp();
      } else if (validateMechTow === 'true') {
        this.checkMechTowCount();
      } else if (ccValidateBlackListClient === 'true') {
        this.checkBlackListInOuClient();
      } else {
        this.checkValidations();
      }
    } catch (error) {
      console.error('Error in selectedPolicyNotification:', error);
    }
  }
  openConfirmPop(title: string, message: string) {
    this.title = title;
    this.confirmMessage = message;
    this.dialogRef = this.dialog.open(this.confirmPop, {
      data: {
        title,
        message,
      },
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addPolicyNotification();
      }
    });
  }
  openConfirmPopUp() {
    this.dialogRef = this.dialog.open(this.confirmPopUp, {
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.checkValidations();
      }
    });
  }

  async onConfirmMessagePopUp() {
    const validateMechTow = await lastValueFrom(
      this.getCoreConfigValueByKey('validateMechTow')
    );
    const ccValidateBlackListClient = await lastValueFrom(
      this.getCoreConfigValueByKey('ccValidateBlackListClient')
    );
    if (validateMechTow === 'true') {
      this.checkMechTowCount();
    } else if (ccValidateBlackListClient === 'true') {
      this.checkBlackListInOuClient();
    } else {
      this.checkValidations();
    }
  }

  checkValidations() {
    const ExpiryFormatDate = moment(
      this.selectedPolicy?.policyExpiryDate,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('DD-MMM-YYYY');
    const carId = this.selectedPolicy!.carId!;
    const lossDateFormatted = this.formatDate(
      this.myForm.get('lossTowLossDate')?.value
    );
    const policyInsuranceId = this.selectedPolicy!.policyInsuranceId!;
    const policyAmendment = this.selectedPolicy!.policyAmendment!;
    const policyPolserno = this.selectedPolicy!.policyPolserno!;
    const policyType = this.selectedPolicy!.policyType!;
    if (this.myForm.valid) {
      this.dataService
        .checkValidations(
          carId!,
          lossDateFormatted,
          policyInsuranceId,
          policyAmendment,
          policyPolserno,
          ExpiryFormatDate,
          this.selectedNature,
          policyType
        )
        .subscribe({
          next: (res) => this.handleValidationResponse(res),
          error: (err) => console.log(err),
        });
    }
  }
  private handleValidationResponse(res: any): void {
    if (res.data.valid) {
      this.addPolicyNotification();
    } else {
      this.handleInvalidValidation(res.data);
    }
    console.log(res);
  }

  private handleInvalidValidation(data: any): void {
    switch (data.title) {
      case 'expiredPOP':
        this.openExpiredPop('Confirmation', data.message);
        break;
      case 'deletedPOP':
        this.openDeletedPop('Confirmation', data.message);
        break;
      case 'canceledPOP':
        this.openCanceledPop('Confirmation', data.message);
        break;
      case 'confirmPop':
        this.openConfirmPop('Confirmation', data.message);
        break;
      default:
        break;
    }
  }

  addPolicyNotification() {
    this.myForm.get('notificationMatDamageCode')?.setValue(this.selectedNature);
    this.myForm.get('insurance')?.setValue(this.insuranceCode);
    const date1 = this.formatDate(this.myForm.get('lossTowLossDate')?.value);
    const date2 = this.formatDate(
      this.myForm.get('notificationReportedDate')?.value
    );

    const formatedDates = {
      ...this.myForm.value,
      lossTowLossDate: date1,
      notificationReportedDate: date2,
    };
    this.dataService.NewPolicyNotificationResponse(formatedDates).subscribe({
      next: (res) => {
        const notificationId = res.data.notificationId;
        this.router.navigate(['/hotline', notificationId]);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  showPanelOne() {
    const selectedNaturesForBodilyInjury = new Set([
      '1',
      '6',
      '5',
      '7',
      '2',
      '10',
      '3',
      '12',
      '13',
      '4',
      '9',
      '14',
      '15',
    ]);
    return selectedNaturesForBodilyInjury.has(this.selectedNature);
  }
  getRelationToOwnerLovFindAll() {
    this.dataService.getRelationToOwnerLovFindAll().subscribe({
      next: (res) => {
        this.relationToDriver = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  showThirdPanel() {
    const selectedNaturesForBodilyInjury = new Set([
      '1',
      '5',
      '6',
      '7',
      '2',
      '10',
      '3',
      '12',
      '13',
      '4',
      '9',
      '14',
      '15',
    ]);
    return selectedNaturesForBodilyInjury.has(this.selectedNature);
  }

  showSixthPanel() {
    const selectedNaturesForBodilyInjury = new Set(['5', '6', '10']);
    return selectedNaturesForBodilyInjury.has(this.selectedNature);
  }
  getTownByName(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataService.getTownByName(event.term).subscribe({
        next: (res) => {
          this.townNameLov = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 300);
  }
  showSecondPanel() {
    const selectedNatures = new Set([
      '1',
      '5',
      '7',
      '2',
      '10',
      '3',
      '12',
      '4',
      '13',
      '9',
      '14',
      '15',
    ]);
    return selectedNatures.has(this.selectedNature);
  }
  showForthPanel() {
    const selectedNatures = new Set([
      '1',
      '6',
      '5',
      '7',
      '2',
      '10',
      '3',
      '12',
      '13',
      '4',
      '9',
      '14',
      '15',
    ]);
    return selectedNatures.has(this.selectedNature);
  }
  showFifthPanel() {
    const selectedNatures = new Set([
      '1',
      '5',
      '7',
      '2',
      '10',
      '3',
      '12',
      '13',
      '9',
      '4',
      '14',
      '15',
    ]);
    return selectedNatures.has(this.selectedNature);
  }
  showBodilyInjuryPanel() {
    const selectedNaturesForBodilyInjury = new Set([
      '1',
      '5',
      '10',
      '3',
      '12',
      '13',
      '4',
      '9',
    ]);
    return selectedNaturesForBodilyInjury.has(this.selectedNature);
  }
  ngOnInit(): void {
    this.createForm();

    this.getDico();
    this.policySearchLov();
    this.getPolicyTypeLovFindAll();
    this.getCompaniesPerUser();
    this.getNotificationNatureLovSelected();
    this.getNotificationNatureLovFindAll();
    this.getReportedByLovFindAll();
    this.getBodilyInjuryLovFindAll();
    this.getRelationToOwnerLovFindAll();
    this.policyNotificationInit();
    this.getInsuranceProductTypes();
  }
  getCoreConfigValueByKey(key: string): Observable<string> {
    return this.dataService.getCoreConfigValueByKey(key).pipe(
      map((val) => val.data),
      catchError((err) => {
        console.error('Error fetching core config value:', err);
        throw err;
      })
    );
  }
  getReportedByLovFindAll() {
    this.dataService.getReportedByLovFindAll().subscribe({
      next: (res) => {
        this.reportedByLov = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {}
  policySearchLov() {
    this.dataService.policySearchLov().subscribe({
      next: (data) => {
        this.policySearch = data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getNotificationNatureLovFindAll() {
    this.dataService.getNotificationNatureLovFindAll().subscribe({
      next: (res) => {
        this.notificationNatureLov = res.data;
        this.filteredData = this.notificationNatureLov.filter((item) =>
          ['1', '5', '6', '7'].includes(item.code)
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onNotificationDamageSubmit() {
    if (this.selectedNature === '7') {
      this.iPolicyType = 'ALL';
    } else {
      this.iPolicyType = 'ALL_TPL';
    }
    const ccPolTowingMap = this.hasPerm('ccPolTowingMap');
    if (ccPolTowingMap) {
      this.loadMap();
    }
  }

  loadMap() {}
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  getInsuranceProductTypes() {
    if (this.insuranceCode !== 'ALL' || this.cmp !== '1') {
      this.dataService
        .getInsuranceProductTypes(this.insuranceCode!, '')
        .subscribe({
          next: (res) => {
            this.products = res.data;
            this.products.unshift({
              productId: 'ALL',
              productDescription: 'ALL',
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  onLossTowBodilyCaseChange() {
    const eventData = this.myForm.get('lossTowBodilyCaseId')?.value;
    if (eventData) {
      if (eventData === '8') {
        this.iPolicyType = 'MOB';
      } else if (eventData === '9') {
        this.iPolicyType = 'SHOW_ALL';
      } else {
        if (eventData === '5' || eventData === '11') {
          this.iPolicyType = 'ALL_TPL';
        }
      }
    }
  }
  getNotificationNatureLovSelected() {
    this.dataService.getNotificationNatureLovSelected('x').subscribe({
      next: (res) => {
        this.notificationNature = res.data;
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
      data: { userCode: this.profileService.getUser() },
      width: '780px',
      height: '550px',
    });
    dialogData.afterClosed().subscribe((data) => {
      if (data) {
        this.myForm.patchValue(data);
        this.myForm.get('policyCarId')?.setValue(null);
        const parseData = data.distributionNoDataDate;
        const parseData1 = data.distributionNoDataEffDate;
        const parseData2 = data.distributionNoDataExpDate;
        if (parseData) {
          const date1 = moment(parseData, 'DD/MM/YYYY HH:mm:ss A').format(
            'YYYY-MM-DDTHH:mm:ss'
          );
          this.myForm.get('distributionNoDataDate')?.setValue(date1);
          console.log(date1);
        }
        if (parseData1) {
          const date2 = moment(parseData1, 'DD/MM/YYYY HH:mm:ss A').format(
            'YYYY-MM-DDTHH:mm:ss'
          );
          this.myForm.get('distributionNoDataEffDate')?.setValue(date2);
        }
        if (parseData2) {
          const date3 = moment(parseData2, 'DD/MM/YYYY HH:mm:ss A').format(
            'YYYY-MM-DDTHH:mm:ss'
          );
          this.myForm.get('distributionNoDataExpDate')?.setValue(date3);
        }

        this.addPolicyNotification();
      }
    });
  }
  getBodilyInjuryLovFindAll() {
    this.dataService.getBodilyInjuryLovFindAll().subscribe({
      next: (res) => {
        this.bodilyInjuriesLov = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleFlip(index: number): void {
    this.isFlipped[index] = !this.isFlipped[index];
  }
  viewPolicyComponent(selectedPolicy: string) {
    this.dialog.open(ViewPolicyDialogComponent, {
      data: {
        carId: selectedPolicy,
      },
      width: '1000px',
      maxHeight: '600px',
    });
  }
  async searchPolicy() {
    const parseData = moment(this.iAsOfDate, 'DD/MM/YYYY').format(
      'DD-MMM-YYYY'
    );

    try {
      this.policyAmendment = await lastValueFrom(
        this.getCoreConfigValueByKey('policyAmendment')
      );
      this.polserno = await lastValueFrom(
        this.getCoreConfigValueByKey('polserno')
      );
      this.policyCar = await lastValueFrom(
        this.getCoreConfigValueByKey('policyCar')
      );
    } catch (error) {
      console.error('Error in policyNotificationInit:', error);
    }
    if (parseData) {
      this.dataService
        .searchPolicy(
          this.iSearchBy!,
          this.iSearchValue!,
          this.iPolicyType!,
          parseData,
          this.insuranceCode!,
          this.product!
        )
        .subscribe({
          next: (res) => {
            this.searchPolicyData = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  getPolicyTypeLovFindAll() {
    this.dataService.getPolicyTypeLovFindAll().subscribe({
      next: (data) => {
        this.policyTypes = data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
