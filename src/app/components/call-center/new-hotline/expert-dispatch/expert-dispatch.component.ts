import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-expert-dispatch',
  templateUrl: './expert-dispatch.component.html',
  styleUrls: ['./expert-dispatch.component.css'],
})
export class ExpertDispatchComponent implements OnInit, OnDestroy {
  dico?: any;
  territoryId?: string;
  insuranceId?: string;
  notificationId?: string;
  notificationMatDamageId?: string;
  notificationReportedDate?: string;
  oClaim?: any;
  insuranceDesc?: string;
  telExtension?: string;
  showTelIcon?: string;
  expertReasons?: type[] = [];
  expertReason: string = '';
  comments: string = '';
  expertReasonCode?: string;
  lossTowId?: string;
  statusCode?: number;
  vNotification?: any[];
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ExpertDispatchComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userRolesService: UsersRolesService
  ) {
    this.territoryId = data.distributionTownId;
    this.insuranceId = data.insuranceId;
    this.insuranceDesc = data.insuranceDesc;
    this.notificationId = data.notificationId;
    this.notificationMatDamageId = data.notificationMatDamageId;
    this.notificationReportedDate = data.notificationReportedDate;
    this.telExtension = data.telExtension;
    this.showTelIcon = data.showTelIcon;
    this.lossTowId = data.lossTowId;
    // console.log(data);
  }
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.getDico();
    this.getVNotificationfindByTeritory();
    this.getFcExpertDispatch();
    this.getExpertReasonLovFindAll();
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
  disableChooseButton(): boolean {
    return (
      this.expertReasonCode == null ||
      this.expertReasonCode === '' ||
      this.oClaim.oclaimexpert == null
    );
  }
  getVNotificationfindByTeritory() {
    // console.log(this.disableChooseButton());
    this.dataService
      .getVNotificationfindByTeritory(
        this.territoryId!,
        this.insuranceId!,
        this.notificationId!
      )
      .subscribe({
        next: (res) => {
          this.vNotification = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getFcExpertDispatch() {
    const reportedDate = this.datePipe.transform(
      this.notificationReportedDate,
      'dd-MMM-yyyy'
    );
    this.dataService
      .getFcExpertDispatch(
        this.insuranceId!,
        '',
        this.notificationId!,
        this.territoryId!,
        '',
        'N',
        this.notificationMatDamageId!,
        reportedDate!
      )
      .subscribe({
        next: (res) => {
          this.oClaim = res.data;
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getRelatedTypeLovFindAll() {
    this.dataService.getRelatedTypeLovFindAll().subscribe({
      next: (res) => {
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getExpertReasonLovFindAll() {
    this.dataService.getExpertReasonLovFindAll().subscribe({
      next: (res) => {
        this.expertReasons = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getFcExpertUnavailable() {
    const oclaimexpert = this.oClaim!.oclaimexpert;
    this.dataService
      .getFcExpertUnavailable(
        this.lossTowId!,
        oclaimexpert,
        this.expertReasonCode!,
        this.comments
      )
      .subscribe({
        next: (res) => {
          this.expertReasonCode = '';
          this.comments = '';
          // this.statusCode = res.statusCode;
          this.getFcExpertDispatch();

          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  dispatchForm(dispatch: boolean) {
    this.dialogRef.close({
      dispatch: dispatch,
      oclaimExpert: this.oClaim.oclaimexpert,
      oclaimexpertname: this.oClaim.oclaimexpertname,
      statusCode: this.statusCode,
    });
  }
}
