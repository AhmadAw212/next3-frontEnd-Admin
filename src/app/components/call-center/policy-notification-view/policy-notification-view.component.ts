import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
    private dialog: MatDialog
  ) {
    this.userRolesService.getUserRoles();
    this.cmp = this.profileService.getCompany()!;
    // console.log(this.cmp);
  }
  onDistributionTownIdChanged() {
    const townNameValue = this.myForm.get('distributionTownName')?.value;
    if (this.selectedNature === '5' || this.selectedNature === '10') {
      this.myForm.get('fromTowTownName')?.setValue(townNameValue);
    }
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
      // console.log('Loss Date Auto:', lossDateAuto);
    } catch (error) {
      // Handle specific error types if needed
      console.error('Error in policyNotificationInit:', error);
    }
  }
  onTabSelected(event: any) {
    this.selectedTabIndex = event.index;

    const selectedCode = this.filteredData[this.selectedTabIndex].code;
    this.selectedNature = selectedCode;
    // console.log('Selected Code:', this.selectedNature);
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
      lossTowDriverName: [''],
      notificationContactName: [''],
      notificationContactPhone: [''],
      towToTownName: [''],
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
        throw err; // Rethrow the error to propagate it to the subscriber
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
        // console.log(this.filteredData);
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

  //TODO
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
    // dialogData.afterClosed().subscribe((data) => {
    //   if (data) {
    //     this.form.patchValue(data);
    //     // this.formData = data;
    //     // console.log(data);
    //   }
    // });
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
  // onTabChange(event: any): void {
  //   // Check the selected tab index and decide when to load dynamic content
  //   if (event.index === 1 && !this.loadDynamicTab) {
  //     this.loadDynamicTab = true;
  //   }
  // }
  toggleFlip(index: number): void {
    this.isFlipped[index] = !this.isFlipped[index];
  }
  viewPolicyComponent(selectedPolicy: string) {
    // console.log(selectedPolicy);
    this.dialog.open(ViewPolicyDialogComponent, {
      data: {
        carId: selectedPolicy,
      },
      width: '1000px',
      maxHeight: '600px',
    });
  }
  async searchPolicy() {
    // let asOfDate: string | null = null;
    console.log(this.iAsOfDate);
    const parseData = moment(this.iAsOfDate, 'DD/MM/YYYY').format(
      'DD-MMM-YYYY'
    );
    // console.log(parseData);
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

            //
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
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  // getPolicyCarInfo(policy: any, i: number) {
  //   this.isFlipped[i] = true;

  //   // this.getNotificationFindById();
  //   // console.log(policy);
  // }
}
