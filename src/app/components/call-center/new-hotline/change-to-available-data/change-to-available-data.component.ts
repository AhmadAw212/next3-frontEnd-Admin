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
import { Subscription } from 'rxjs';

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
  isFlipped: boolean = false;
  searchPolicyData: any[] = [];
  getInsuranceSubscription?: Subscription;
  polserno?: string;
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
    console.log(data.createNoData);
  }

  private initializeData() {
    const dataChange = this.data.changeAvailableData;
    this.polserno = this.data.polserno;

    if (dataChange) {
      this.iSearchValue = dataChange.iSearchValue;
      this.iSearchBy = dataChange.iSearchBy;
      this.iAsOfDate =
        dataChange.iAsOfDate ||
        this.datePipe.transform(this.data, 'reportDateFormat');
      this.iPolicyType = dataChange.iPolicyType;
      this.searchPolicyData = dataChange.policyData;
    }
    if (this.data.createNoData) {
      const {
        distributionNoDataPlateB,
        distributionNoDataPlate,
        distributionNoDataName,
        distributionNoDataPolicy,
        distributionNoDataRemarks,
        lossTowLossDate,
        distributionNoDataEffDate,
        distributionNoDataExpDate,
        distributionNoDataBroker,
        distributionNoDataCarBrand,
        insuranceId,
      } = this.data.createNoData;

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
      this.insuranceCode = insuranceId;

      if (!dataChange?.iAsOfDate) {
        this.iAsOfDate = this.datePipe.transform(
          lossTowLossDate,
          this.dateFormat('reportDateFormat')
        )!;
      }

      // Initialize other properties here if needed
    } else {
      this.distributionNoDataPlateB = '';
      this.distributionNoDataPlate = '';
      this.distributionNoDataName = '';
      this.distributionNoDataPolicy = '';
      this.distributionNoDataRemarks = '';
      this.distributionNoDataEffDate = '';
      this.distributionNoDataExpDate = '';
      this.distributionNoDataBroker = '';
      this.distributionNoDataCarBrand = '';
    }
  }
  toggleFlip() {
    this.isFlipped = !this.isFlipped;
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
    let asOfDate: string | null = null;

    // Check if this.iAsOfDate is a valid string
    if (typeof this.iAsOfDate === 'string') {
      // Step 1: Parse the initial date string into a JavaScript Date object
      const initialDateParts = this.iAsOfDate.split('/');
      if (initialDateParts.length === 3) {
        const initialDate = new Date(
          parseInt(initialDateParts[2]), // Year
          parseInt(initialDateParts[1]) - 1, // Month (0-based index)
          parseInt(initialDateParts[0]) // Day
        );

        // Step 2: Format the Date object into 'dd-MMM-YYYY' format
        asOfDate = this.datePipe.transform(initialDate, 'dd-MMM-yyyy');
      }
    } else if (this.iAsOfDate instanceof Date) {
      // Handle the case where this.iAsOfDate is a Date object
      asOfDate = this.datePipe.transform(this.iAsOfDate, 'dd-MMM-yyyy');
    }

    if (asOfDate) {
      this.dataService
        .searchPolicy(
          this.iSearchBy!,
          this.iSearchValue!,
          this.iPolicyType!,
          asOfDate,
          this.insuranceCode!,
          ''
        )
        .subscribe({
          next: (res) => {
            this.searchPolicyData = res.data;
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      // Handle the case where this.iAsOfDate is neither a valid string nor a Date object
      console.log('Invalid asOfDate format');
    }
  }
}
