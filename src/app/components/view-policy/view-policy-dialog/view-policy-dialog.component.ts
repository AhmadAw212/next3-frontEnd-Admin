import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-view-policy-dialog',
  templateUrl: './view-policy-dialog.component.html',
  styleUrls: ['./view-policy-dialog.component.css'],
})
export class ViewPolicyDialogComponent implements OnInit, OnDestroy {
  dico?: any;
  policyData?: any;
  policyCoverlist?: any;
  carId?: string;
  companyLogo?: string;
  policySubscription?: Subscription;
  companyLogoSubscription?: Subscription;
  isLoading: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewPolicyDialogComponent>,
    private dicoService: DicoServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService
  ) {
    this.carId = data.carId;
  }
  ngOnDestroy(): void {
    if (this.policySubscription || this.companyLogoSubscription) {
      this.policySubscription?.unsubscribe();
      this.companyLogoSubscription?.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.viewPolicy();
    // this.getCompanyogo();
    this.getDico();
  }
  getCompanyogo(companyId: string) {
    this.companyLogoSubscription = this.dataService
      .getCompanyLogo(companyId)
      .subscribe({
        next: (data) => {
          // `data:image/jpeg;base64,${res.content}`
          this.companyLogo = `data:image/jpeg;base64,${data.data}`;
          // console.log(data);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
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

  viewPolicy() {
    this.policySubscription = this.dataService
      .viewPolicy(this.carId!)
      .subscribe({
        next: (data) => {
          this.policyData = data.data;
          this.policyCoverlist = data.data?.policyCoverlist;
          const companyId = data.data?.insuranceCode;
          this.getCompanyogo(companyId);
          // console.log(data.data);
        },
        error: (error) => {
          // this.policyData = [];
          this.close();
          console.log(error);
          // console.log(error);
        },
      });
  }

  close() {
    this.dialogRef.close();
  }
}
