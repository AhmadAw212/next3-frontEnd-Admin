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
import { Subject, debounceTime, switchMap } from 'rxjs';
import * as moment from 'moment';
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
  dico: any;
  searchTypes: any[] = [];
  company: string = '';
  companies: CompanyBranchList[] = [];
  isSurveyRequestInformationIncluded?: boolean;
  surveyRequestBySearchParameters: any[] = [];
  selectedRowIndex: number = 0;
  private dialogRef!: MatDialogRef<any>;
  selectedCost: string = '';
  WithOrWithoutCost: SelectItem[] = [];
  followUpTypes: SelectItem[] = [];
  suppliersNames?: any[] = [];
  surveyListExcelData: SurveyData[] = [];
  surveyListFollowUpExcelData: any[] = [];
  surveyorName: string = '';
  type: string = '';
  surveyorNameSurveyList: string = '';
  typeSurveyList: string = '';
  fromDateSurveyList?: string | null;
  companySurveyList: string = 'ALL';
  ToDateSurveyList?: string | null;
  selectedCostSurveyList: string = '';
  notificationSurveyList: string = '';
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
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.initializeSearchTypes();
    this.getCompaniesPerUser();
    this.getWithOrWithoutCost();
    this.setupSearchListener();
    this.getSurveyFollowUpType();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
