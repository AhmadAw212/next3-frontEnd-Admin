import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { SurveyService } from '../services/survey.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime, lastValueFrom, switchMap } from 'rxjs';
import * as moment from 'moment';
import { ApiResponse } from 'src/app/model/api-response';
import { SurveySearchDto } from '../model/requests/survey-search-dto';
import { SurveySearchResult } from '../model/response/survey-search-result';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatamgmtService } from '../../data-mgmt/services/datamgmt.service';
import { type } from 'src/app/model/type';
export interface SelectItem {
  value: string;
  label: string;
}
interface SurveyData {
  surveyMonth: string;
  surveyDate: string;
  visa: string;
  garageName: string;
  surveyRequestNote: string;
  townName: string;
  cazaName: string;
  regionName: string;
  surveyKm: string;
  surveyCost: string;
  insCompany: string;
  surveyorId: string;
  surveyorName: string;
  address: string;
  repairType: string;
}
interface SurveyCheckingList {
  notification?: number;
  vehSeqDecode?: string;
  ownerName?: string;
  plate?: string;
  brandTrademark?: string;
  yearMan?: number;
  surveyor?: string;
  surveyDispatchDate?: string;
  town?: string;
  garage?: string;
  insCompany?: string;
  surveyRequestDate?: string;
  reqUser?: string;
  cancelUser?: string;
  surveyRequestCancelDate?: string;
  cancelReason?: string;
  requestAddress?: string;
  requestNote?: string;
  repairType?: string;
}
@Component({
  selector: 'app-request-survey',
  templateUrl: './request-survey.component.html',
  styleUrls: ['./request-survey.component.css'],
})
export class RequestSurveyComponent implements OnInit {
  @ViewChild('surveyListExcel') surveyListExcel!: TemplateRef<any>;
  @ViewChild('followUpExcel') followUpExcel!: TemplateRef<any>;
  @ViewChild('surveyCheckExcel') surveyCheckExcel!: TemplateRef<any>;
  @ViewChild('printSurveySent') printSurveySent!: TemplateRef<any>;
  @ViewChild('addTpLossCar') addTpLossCar!: TemplateRef<any>;
  dico: any;
  searchTypes: any[] = [];
  insuranceId: string = '';
  companies: CompanyBranchList[] = [];
  isSurveyRequestInformationIncluded: boolean = false;
  surveyRequestBySearchParameters: SurveySearchResult[] = [];
  selectedRowIndex: number = 0;
  private dialogRef!: MatDialogRef<any>;
  selectedCost: string = '';
  WithOrWithoutCost: SelectItem[] = [];
  followUpTypes: SelectItem[] = [];
  suppliersNames?: any[] = [];
  surveyListExcelData: SurveyData[] = [];
  surveyListFollowUpExcelData: any[] = [];
  supplierId: string = '';
  type: string = '';
  surveyorNameSurveyList: string = '';
  lossCarSearchCode: string = 'NOTIFICATION';
  lossCarSearchValue: string = '';
  surveyStatus: string = '';
  typeSurveyList: string = '';
  fromDateSurveyList?: string | null;
  companySurveyList: string = 'ALL';
  ToDateSurveyList?: string | null;
  fromDate: string = '';
  toDate: string = '';
  brandsDesc: type[] = [];
  tradeMarkDesc: type[] = [];
  shapeDescList: type[] = [];
  selectedCostSurveyList: string = '';
  vip: string = '';
  notificationSurveyList: string = '';
  pageSize: number = 5;
  pageNumber: number = 1;
  totalItems!: number;
  totalPages!: number;
  addTpForm!: FormGroup;
  companyLogo!: string;
  private searchTimer: any;
  render: boolean = false;
  selectedSurvey!: SurveySearchResult;
  surveyListCheckingExcelData: SurveyCheckingList[] = [];
  surveyStatusOptions: SelectItem[] = [];
  private searchTimer$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  constructor(
    private surveyService: SurveyService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private sharedService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dataMgmtServive: DatamgmtService
  ) {
    const companyId = this.sharedService.getCompany()!;
    this.insuranceId = companyId;
    this.companySurveyList = companyId;
  }
  ngOnInit(): void {
    this.getDico();
    this.initializeSearchTypes();
    this.getCompaniesPerUser();
    this.getWithOrWithoutCost();
    this.setupSearchListener();
    this.getSurveyFollowUpType();
    this.getSurveyStatus();
    this.getUserLastNotification();
    this.createAddTpForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.searchSurvey();
  }
  createAddTpForm() {
    this.addTpForm = this.fb.group({
      visa: [{ value: '', disabled: true }, Validators.pattern('^[0-9]*$')],
      carOwnerFirstName: [''],
      carOwnerFatherName: [''],
      carOwnerFamilyName: [''],
      carPlateChar: [''],
      carPlateNum: ['', Validators.pattern('^[0-9]*$')],
      carCarBrand: [''],
      carBrandId: [''],
      carCarTrademark: [{ value: '', disabled: true }],
      carTradeMarkId: [''],
      carCarShape: [{ value: '', disabled: true }],
      carYearManfact: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.min(1970),
          Validators.max(this.getMaxYom()),
        ],
      ],
    });
  }
  onTrademarkSelectionChange(selectedTrademarkCode: any) {
    const carTradeMarkIdControl = this.addTpForm.get('carTradeMarkId');
    const carCarShapeControl = this.addTpForm.get('carCarShape');

    if (selectedTrademarkCode) {
      carTradeMarkIdControl?.setValue(selectedTrademarkCode);
      carCarShapeControl?.enable();
    } else {
      carCarShapeControl?.setValue(null);
      carCarShapeControl?.disable();
    }
  }
  getCarShapeIdByBrandIdAndTradeMarkIdAndShapeDescription(event: any) {
    const trademarkId = this.addTpForm.get('carTradeMarkId')?.value;
    const brandId = this.addTpForm.get('carBrandId')?.value;
    clearTimeout(this.searchTimer);
    if (trademarkId && brandId && event.term) {
      this.searchTimer = setTimeout(() => {
        this.dataMgmtServive
          .getCarShapeIdByBrandIdAndTradeMarkIdAndShapeDescription(
            brandId,
            trademarkId,
            event.term
          )
          .subscribe({
            next: (res) => {
              this.shapeDescList = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      }, 500);
    }
  }
  getCarBrandFindByDescription(event: any) {
    clearTimeout(this.searchTimer);
    if (event.term) {
      this.searchTimer = setTimeout(() => {
        this.dataMgmtServive
          .getCarBrandFindByDescription(event.term)
          .subscribe({
            next: (res) => {
              this.brandsDesc = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      }, 500);
    }
  }
  getCarTrademarkDescription(event: any) {
    const brandId = this.addTpForm.get('carBrandId')?.value;
    clearTimeout(this.searchTimer);
    if (brandId && event.term) {
      this.searchTimer = setTimeout(() => {
        this.dataMgmtServive
          .getCarTrademarkDescription(brandId, event.term)
          .subscribe({
            next: (res) => {
              this.tradeMarkDesc = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      }, 500);
    }
  }
  onBrandSelectionChange(selectedBrandCode: any) {
    const carBrandIdControl = this.addTpForm.get('carBrandId');
    const carCarTrademarkControl = this.addTpForm.get('carCarTrademark');
    const carCarShapeControl = this.addTpForm.get('carCarShape');

    if (selectedBrandCode) {
      carBrandIdControl?.setValue(selectedBrandCode);
      carCarTrademarkControl?.enable();
    } else {
      carCarTrademarkControl?.setValue(null);
      carCarTrademarkControl?.disable();
      carCarShapeControl?.setValue(null);
      carCarShapeControl?.disable();
    }
  }
  addTpLossCarSubmit() {
    console.log(this.addTpForm.value);
  }
  getMaxYom(): number {
    const cal: Date = new Date();
    const maxYom: number = cal.getFullYear() + 1;

    return maxYom;
  }
  onSelectSurvey(survey: SurveySearchResult, index: number) {
    this.selectedSurvey = survey;
    this.selectedRowIndex = index;
    this.render = true;
    this.getUserRefreshLogCount(survey.notification, survey.plate);
    if (survey.claimStatus === '8') {
      this.alertifyService.dialogAlert(
        'Claim is closed , you need to reopen claim to add new survey',
        'Alert'
      );
    } else if (survey.productType === 'TPL' && survey.insured === 'Insured') {
      this.alertifyService.dialogAlert('TPL Policy', 'Alert');
    }
  }
  getUserRefreshLogCount(visa: string, plate: string) {
    try {
      const res = lastValueFrom(
        this.dataMgmtServive.getUserRefreshLogCount(visa, plate)
      );
    } catch (err) {
      console.error(err);
    }
  }
  async openAddTpp(selectedTp: SurveySearchResult) {
    if (selectedTp.claimStatus === '8') {
      this.alertifyService.dialogAlert(
        'Claim is closed, you need to reopen the claim to add a new TP ',
        'Closed'
      );
      return;
    }

    try {
      const res = await lastValueFrom(
        this.surveyService.getNotificationNatureCodeAndDesc(
          selectedTp.notificationId
        )
      );

      // console.log(res);
      const natureCode = res?.data[0].code;
      const natureDescription = res?.data[0].description;

      if (this.isNatureRestricted(natureCode)) {
        this.alertifyService.dialogAlert(
          `You are not allowed to add TP to a claim with nature: ${natureDescription} <br/> Only authorized person are allowed to add from Data Entry`,
          'Alert'
        );
      } else {
        // Continue only if the nature is allowed
        this.createAddTpForm();
        this.openAddTpDialog(selectedTp);
      }
    } catch (err) {
      console.error(err);
      this.alertifyService.dialogAlert(
        'An error occurred while fetching nature information. Please try again.',
        'Error'
      );
    }
  }
  private isNatureRestricted(natureCode: string) {
    const restrictedNatureCodes = ['2', '3', '4', '6', '7', '10', '12', '13'];
    return natureCode && restrictedNatureCodes.includes(natureCode);
  }

  private openAddTpDialog(selectedTp: SurveySearchResult): void {
    this.dialogRef = this.dialog.open(this.addTpLossCar, {
      width: '300px',
      height: '500px',
      data: { selectedTp: selectedTp },
    });

    this.dialogRef.afterOpened().subscribe(() => {
      if (this.dialogRef) {
        this.addTpForm.get('visa')?.setValue(selectedTp.notification);
        this.companyLogo = selectedTp?.companyLogo;
      }
    });
  }

  getNotificationNatureCodeAndDesc(notificationId: string) {
    this.surveyService
      .getNotificationNatureCodeAndDesc(notificationId)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  getUserLastNotification() {
    this.surveyService.getUserLastNotification().subscribe({
      next: (res) => {
        this.lossCarSearchValue = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  private setupSearchListener() {
    this.searchTimer$
      .pipe(
        debounceTime(500),
        switchMap((term: string) =>
          this.surveyService.getSurveyorByNamePreference(term)
        )
        // You can add catchError if needed
      )
      .subscribe({
        next: (res) => {
          this.suppliersNames = res.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  getSurveyorsName(event: any) {
    this.searchTimer$.next(event.term);
  }
  onNoClick() {
    this.dialogRef.close();
  }
  openSurveyListExcel() {
    this.dialogRef = this.dialog.open(this.surveyListExcel, {
      width: '700px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  openFollowUpExcel() {
    this.dialogRef = this.dialog.open(this.followUpExcel, {
      width: '700px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  openSurveyCheckExcel() {
    this.dialogRef = this.dialog.open(this.surveyCheckExcel, {
      width: '700px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  openPrintSurveySent() {
    this.dialogRef = this.dialog.open(this.printSurveySent, {
      width: '700px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  getWithOrWithoutCost(): SelectItem[] {
    const result: SelectItem[] = [];

    result.push({ value: 'ALL', label: 'ALL' });
    result.push({ value: 'N', label: 'Without Cost' });
    result.push({ value: 'Y', label: 'With Cost' });
    this.WithOrWithoutCost = result;
    return result;
  }
  getSurveyStatus(): SelectItem[] {
    const result: SelectItem[] = [
      { value: 'NOT_YET_DISPATCHED', label: 'NOT YET DISPATCHED' },
      { value: 'DISPATCHED', label: 'DISPATCHED' },
      { value: 'ALL', label: 'ALL' },
    ];
    this.surveyStatusOptions = result;
    return result;
  }
  getSurveyRequestExcelValues() {
    const parsedFromDate = this.fromDateSurveyList
      ? moment(this.fromDateSurveyList, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'DD-MMM-YYYY'
        )
      : '';
    const parsedToDate = this.ToDateSurveyList
      ? moment(this.ToDateSurveyList, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'DD-MMM-YYYY'
        )
      : '';
    this.surveyService
      .getSurveyRequestExcelValues(
        this.companySurveyList,
        this.notificationSurveyList,
        this.surveyorNameSurveyList,
        parsedFromDate,
        parsedToDate,
        this.selectedCostSurveyList
      )
      .subscribe({
        next: (res) => {
          this.surveyListExcelData = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.exportToExcelSurveyList();
        },
      });
  }
  getSurveyDispatchFollowUpList() {
    const parsedFromDate = this.fromDateSurveyList
      ? moment(this.fromDateSurveyList, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'DD-MMM-YYYY'
        )
      : '';
    const parsedToDate = this.ToDateSurveyList
      ? moment(this.ToDateSurveyList, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'DD-MMM-YYYY'
        )
      : '';
    if (!parsedFromDate && !parsedToDate) {
      return this.alertifyService.dialogAlert(
        'Please make sure you fill from date and to date',
        'Requied Fields'
      );
    }
    this.surveyService
      .getSurveyDispatchFollowUpList(
        this.companySurveyList,
        this.notificationSurveyList,
        this.surveyorNameSurveyList,
        parsedFromDate,
        parsedToDate,
        this.typeSurveyList
      )
      .subscribe({
        next: (res) => {
          this.surveyListFollowUpExcelData = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.exportToExcelSurveyListFollowUp();
        },
      });
  }
  getSurveyCheckingList() {
    const parsedFromDate = this.fromDateSurveyList
      ? moment(this.fromDateSurveyList, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'DD-MMM-YYYY'
        )
      : '';
    const parsedToDate = this.ToDateSurveyList
      ? moment(this.ToDateSurveyList, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'DD-MMM-YYYY'
        )
      : '';
    if (!parsedFromDate && !parsedToDate) {
      return this.alertifyService.dialogAlert(
        'Please make sure you fill from date and to date',
        'Requied Fields'
      );
    }
    this.surveyService
      .getSurveyCheckingList(
        this.companySurveyList,
        this.surveyorNameSurveyList,
        parsedFromDate,
        parsedToDate
      )
      .subscribe({
        next: (res) => {
          this.surveyListCheckingExcelData = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.exportToExcelSurveyListCheckList();
        },
      });
  }
  exportToExcelSurveyList() {
    const notification = this.dico?.dico_notification;

    const data =
      this.surveyListExcelData && this.surveyListExcelData.length > 0
        ? this.surveyListExcelData.map((item: SurveyData) => ({
            Month: item.surveyMonth || '',
            Date: item.surveyDate || '',
            [notification]: item.visa || '', // Renamed to be consistent
            'Location / Number': item.garageName || '',
            'Request Note': item.surveyRequestNote || '',
            Town: item.townName || '',
            Caza: item.cazaName || '',
            Region: item.regionName || '',
            Address: item.address || '', // Corrected spelling
            'Repair Type': item.repairType || '',
            'Value in KM': item.surveyKm || '',
            'Value in USD': item.surveyCost || '',
            Company: item.insCompany || '',
            Surveyor: item.surveyorName || '',
          }))
        : [
            {
              Month: '',
              Date: '',
              Notification: '',
              'Location / Number': '',
              'Request Note': '',
              Town: '',
              Caza: '',
              Region: '',
              Address: '',
              'Repair Type': '',
              'Value in KM': '',
              'Value in USD': '',
              Company: '',
              Surveyor: '',
            },
          ];

    // Call the exportToExcel method with your data
    this.sharedService.exportToExcel(data, 'Survey List', 'Survey_List.xlsx');
  }

  exportToExcelSurveyListFollowUp() {
    const notification = this.dico?.dico_notification;
    const data =
      this.surveyListFollowUpExcelData &&
      this.surveyListFollowUpExcelData.length > 0
        ? this.surveyListFollowUpExcelData.map((item: SurveyData) => ({
            [notification]: item.visa || '', // Renamed to be consistent
            'Insured-Tp': item.surveyMonth || '',
            'Owner Name': item.surveyDate || '',
            'Car Plate': item.garageName || '',
            'Car Brand': item.surveyRequestNote || '',
            'Car YOM': item.townName || '',
            Surveyor: item.cazaName || '',
            'Dispatch Date': item.regionName || '',
            Town: item.address || '', // Corrected spelling
            Address: item.repairType || '',
            Note: item.surveyKm || '',
            'Repair Type': item.surveyCost || '',
            Garage: item.insCompany || '',
            Company: item.surveyorName || '',
            'Dispatched/Served': item.surveyorName || '',
          }))
        : [
            {
              [notification]: '',
              'Insured-Tp': '',
              'Owner Name': '',
              'Car Plate': '',
              'Car Brand': '',
              'Car YOM': '',
              Surveyor: '',
              'Dispatch Date': '',
              Town: '',
              Address: '',
              Note: '',
              'Repair Type': '',
              Garage: '',
              Company: '',
              'Dispatched/Served': '',
            },
          ];

    // Call the exportToExcel method with your data
    this.sharedService.exportToExcel(
      data,
      'Survey Follow Up List',
      'Survey_Follow_up_List.xlsx'
    );
  }
  exportToExcelSurveyListCheckList() {
    const notification = this.dico?.dico_notification;
    const data =
      this.surveyListFollowUpExcelData &&
      this.surveyListFollowUpExcelData.length > 0
        ? this.surveyListFollowUpExcelData.map((item: SurveyCheckingList) => ({
            [notification]: item.notification || '', // Renamed to be consistent
            'Insured-Tp': item.insCompany || '',
            'Request Date': item.surveyRequestDate || '',
            'Request User': item.reqUser || '',
            'Owner Name': item.ownerName || '',
            'Car Plate': item.plate || '',
            'Car Brand': item.brandTrademark || '',
            'Car YOM': item.yearMan || '',
            Surveyor: item.surveyor || '', // Corrected spelling
            'Dispatch Date': item.surveyDispatchDate || '',
            Town: item.town || '',
            Address: item.requestAddress || '',
            Notes: item.requestNote || '',
            'Repair Type': item.repairType || '',
            Garage: item.garage || '',
            'Cancel Date': item.surveyRequestCancelDate || '',
            'Cancel User': item.cancelUser || '',
            'Cancel Reason': item.cancelReason || '',
            Company: item.insCompany || '',
          }))
        : [
            {
              [notification]: '', // Renamed to be consistent
              'Insured-Tp': '',
              'Request Date': '',
              'Request User': '',
              'Owner Name': '',
              'Car Plate': '',
              'Car Brand': '',
              'Car YOM': '',
              Surveyor: '', // Corrected spelling
              'Dispatch Date': '',
              Town: '',
              Address: '',
              Notes: '',
              'Repair Type': '',
              Garage: '',
              'Cancel Date': '',
              'Cancel User': '',
              'Cancel Reason': '',
              Company: '',
            },
          ];

    // Call the exportToExcel method with your data
    this.sharedService.exportToExcel(
      data,
      'Survey Check List List',
      'Survey_Check_List.xlsx'
    );
  }
  getSurveyFollowUpType(): SelectItem[] {
    const result: SelectItem[] = [];

    result.push({ value: 'ALL', label: 'ALL' });
    result.push({ value: 'NOT_UPLOADED', label: 'Not Uploaded' });
    result.push({ value: 'SURVEY_SHEET', label: 'Only Survey Sheet Uploaded' });
    result.push({
      value: 'SURVEY_PIC',
      label: 'Only Survey Pictures Uploaded',
    });
    result.push({ value: 'UPLOADED', label: 'Uploaded Survey Sheet And Pic' });
    this.followUpTypes = result;
    return result;
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.companies.push({
          companyId: 'ALL',
          companyName: 'ALL',
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  initializeSearchTypes() {
    const notification = this.dico?.dico_notification;

    // Replace with actual header
    this.searchTypes = [
      { code: 'NOTIFICATION', description: 'Visa' },
      { code: 'PLATE', description: 'Plate' },
      { code: 'PHONE', description: 'Phone' },
      { code: 'BRAND', description: 'Brand' },
      { code: 'CLAIM', description: 'Claim' },
      { code: 'NAME', description: 'Name' },
      { code: 'CHASIS', description: 'Chasis' },
      { code: 'POLICY', description: 'Policy' },
    ];
  }

  searchSurvey(): void {
    // Create an instance of your DTO
    const parsedFromDate = this.fromDate
      ? moment(this.fromDate, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'YYYY-MM-DDTHH:mm:ss'
        )
      : '';
    const parsedToDate = this.toDate
      ? moment(this.toDate, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
          'YYYY-MM-DDTHH:mm:ss'
        )
      : '';
    const surveySearchRequest: SurveySearchDto = {
      supplierId: this.supplierId,
      lossCarSearchCode: this.lossCarSearchCode,
      lossCarSearchValue: this.lossCarSearchValue,
      surveyStatus: this.surveyStatus,
      fromDate: parsedFromDate,
      toDate: parsedToDate!,
      vip: this.vip,
      insuranceId: this.insuranceId,
      isSurveyRequestInformationIncluded:
        this.isSurveyRequestInformationIncluded,
    };

    this.surveyService
      .searchSurveyCall(surveySearchRequest, this.pageSize, this.pageNumber)
      .subscribe({
        next: (res: ApiResponse) => {
          this.surveyRequestBySearchParameters = res.data.data;
          this.totalItems = res.data.totalItems;
          this.totalPages = res.data.totalPages;
          // console.log(res.data.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
