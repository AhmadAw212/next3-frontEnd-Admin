import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { CreateNoDataDialogComponent } from '../create-no-data-dialog/create-no-data-dialog.component';
import { type } from 'src/app/model/type';
import { Subscription, catchError, lastValueFrom, map } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-change-to-available-data',
  templateUrl: './change-to-available-data.component.html',
  styleUrls: ['./change-to-available-data.component.css'],
})
export class ChangeToAvailableDataComponent implements OnInit {
  dico?: any;
  distributionNoDataPlateB?: string;
  distributionNoDataPlate?: string;
  distributionNoDataName?: string;
  distributionNoDataPolicy?: string;
  distributionNoDataRemarks?: string;
  distributionNoDataEffDate?: string;
  distributionNoDataExpDate?: string;
  distributionNoDataBroker?: string;
  distributionNoDataCarBrand?: string;
  policySearch: type[] = [];
  policyTypes: type[] = [];
  iAsOfDate?: any;
  policyTypesLov?: boolean = false;
  iSearchBy: string = 'PlateNumber';
  iSearchValue?: string = '';
  iPolicyType: string = 'ALL_TPL';
  changeData?: any;
  insuranceCode: string = 'ALL';
  companies?: any;
  isFlipped: boolean[] = [];
  searchPolicyData: any[] = [];
  getInsuranceSubscription?: Subscription;
  polserno?: string;
  notificationId?: string;
  policyEffectiveDate?: any;
  lossTowLossDate?: any;
  policyResult?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChangeToAvailableDataComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.initializeData();
    this.companies = data.companies;
    this.notificationId = data.notificationId;
    this.policyEffectiveDate = data.policyEffectiveDate;
    this.lossTowLossDate = data.lossTowLossDate;
    // console.log(this.policyEffectiveDate, this.notificationId);
  }

  private initializeData() {
    // const dataChange = this.data;
    this.polserno = this.data.polserno;
    this.iSearchValue = this.data.distributionNoDataPlate;
    // const lossTowLossDate = dataChange.lossTowLossDate
    this.iAsOfDate = this.datePipe.transform(
      this.data.lossTowLossDate,
      this.dateFormat('reportDateFormat')
    );
    const insuranceId = this.data.insuranceId;
    this.insuranceCode = insuranceId;
    if (this.data) {
      const {
        distributionNoDataPlateB,
        distributionNoDataPlate,
        distributionNoDataName,
        distributionNoDataPolicy,
        distributionNoDataRemarks,
        distributionNoDataEffDate,
        distributionNoDataExpDate,
        distributionNoDataBroker,
        distributionNoDataCarBrand,
      } = this.data;

      this.distributionNoDataPlateB = distributionNoDataPlateB;
      this.distributionNoDataPlate = distributionNoDataPlate;
      this.distributionNoDataName = distributionNoDataName;
      this.distributionNoDataPolicy = distributionNoDataPolicy;
      this.distributionNoDataRemarks = distributionNoDataRemarks;
      this.distributionNoDataEffDate = distributionNoDataEffDate;
      // console.log(this.distributionNoDataEffDate);
      this.distributionNoDataExpDate = distributionNoDataExpDate;
      // console.log(this.distributionNoDataExpDate);
      this.distributionNoDataBroker = distributionNoDataBroker;
      this.distributionNoDataCarBrand = distributionNoDataCarBrand;

      // Initialize other properties here if needed
    }
  }

  async getPolicyCarById(carId: string): Promise<any> {
    try {
      const res = await lastValueFrom(this.dataService.getPolicyCarById(carId));
      this.policyResult = res.data;
      return this.policyResult;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  getPolicyCarInfo(policy: any, i: number) {
    this.isFlipped[i] = true;
    this.getPolicyCarById(policy.carId).then((res) => {
      this.dialogRef.close(res);
      // console.log(res);
    });
    // this.getNotificationFindById();
    // console.log(policy);
  }
  getNotificationFindById() {
    const notId = this.notificationId;
    const policyEffectiveDate = moment(
      this.policyEffectiveDate,
      'YYYY-MM-DDTHH:mm:ss'
    );
    const lossTowLossDate = moment(this.lossTowLossDate, 'YYYY-MM-DDTHH:mm:ss');

    if (policyEffectiveDate.isAfter(lossTowLossDate)) {
      this.alertifyService.dialogAlert(
        'Loss Date Is Before Policy Effective Date',
        'Error'
      );
    }
    if (notId) {
      this.dataService.getNotificationFindById(notId).subscribe({
        next: (res) => {
          // this.dialogRef.close(res.data);
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  toggleFlip(index: number): void {
    this.isFlipped[index] = !this.isFlipped[index];
  }
  ngOnInit(): void {
    this.getDico();
    this.policySearchLov();
    this.getPolicyTypeLovFindAll();
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

  saveData() {
    this.changeData = {
      iAsOfDate: this.iAsOfDate,
      iSearchBy: this.iSearchBy,
      iSearchValue: this.iSearchValue,
      iPolicyType: this.iPolicyType,
      insuranceCode: this.insuranceCode,
      policyData: this.searchPolicyData,
    };

    this.dialogRef.close(this.changeData);
  }
  searchPolicy() {
    // let asOfDate: string | null = null;
    console.log(this.iAsOfDate);
    const parseData = moment(this.iAsOfDate, 'DD/MM/YYYY').format(
      'DD-MMM-YYYY'
    );
    // console.log(parseData);

    if (parseData) {
      this.dataService
        .searchPolicy(
          this.iSearchBy!,
          this.iSearchValue!,
          this.iPolicyType!,
          parseData,
          this.insuranceCode!,
          ''
        )
        .subscribe({
          next: (res) => {
            this.searchPolicyData = res.data;
            // console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
}
