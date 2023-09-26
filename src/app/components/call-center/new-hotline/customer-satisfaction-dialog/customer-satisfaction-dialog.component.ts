import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-customer-satisfaction-dialog',
  templateUrl: './customer-satisfaction-dialog.component.html',
  styleUrls: ['./customer-satisfaction-dialog.component.css'],
})
export class CustomerSatisfactionDialogComponent {
  dico?: any;
  ratingValue: number = 0;
  carPlate?: string;
  brandDesc?: string;
  notificationContactName?: string;
  notificationContactPhone?: string;
  towFromTownDescription?: string;
  towToTownDescription?: string;
  towingComDesc?: string;
  notificationMatDamageDesc?: string;
  distributionLossDistDate?: string;
  dispatchFuArrivedDate?: string;
  domainYn: type[] = [];
  expertDelayReason: type[] = [];
  carsDispatchFollowUpList: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CustomerSatisfactionDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.carPlate = data.carPlate;
    this.brandDesc = data.brandDescription;
    this.notificationContactName = data.notificationContactName;
    this.notificationContactPhone = data.notificationContactPhone;
    this.towFromTownDescription = data.towFromTownDescription;
    this.towToTownDescription = data.towToTownDescription;
    this.towingComDesc = data.towingComDesc;
    this.notificationMatDamageDesc = data.notificationMatDamageDesc;
    this.carsDispatchFollowUpList = data.carsDispatchFollowUpList[0];
    this.distributionLossDistDate = this.datePipe.transform(
      data.distributionLossDistDate,
      this.dateFormat('reportDateTimeFormat')
    )!;
    console.log(data);
  }
  ngOnInit(): void {
    this.getDico();
    this.getDomainYN();
    this.getExpertDelayReasonLovFindAll();
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
  getDomainYN() {
    this.dataService.getDomainYN().subscribe({
      next: (data) => {
        this.domainYn = data.data.filter((item: any) => item.code !== 'ALL');
        // console.log(this.domainYn);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getExpertDelayReasonLovFindAll() {
    this.dataService.getExpertDelayReasonLovFindAll().subscribe({
      next: (res) => {
        this.expertDelayReason = res.data;
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
