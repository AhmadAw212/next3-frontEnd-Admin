import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DatamgmtService } from '../services/datamgmt.service';
import { ActivatedRoute } from '@angular/router';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-data-entry-list-view',
  templateUrl: './new-data-entry-list-view.component.html',
  styleUrls: ['./new-data-entry-list-view.component.css'],
})
export class NewDataEntryListViewComponent implements OnInit, OnDestroy {
  dico?: any;
  type?: string;
  nature?: string;
  pageSize: number = 10;
  pageNumber: number = 1;
  dataEntryList: any[] = [];
  totalItems!: number;
  totalPages!: number;
  dataEntrySub!: Subscription;
  constructor(
    private dataMgmtServive: DatamgmtService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService,
    private companyService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private route: ActivatedRoute,
    private dateFormatService: DateFormatterService,
    private sharedService: LoadingServiceService,
    private datePipe: DatePipe
  ) {}
  ngOnDestroy(): void {
    if (this.dataEntrySub) {
      this.dataEntrySub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getDico();
    this.route.queryParams.subscribe((params) => {
      this.type = params['type'];
      this.nature = params['nature'];
      this.getNewDataEntryList();
    });
    // console.log(this.type);
    // console.log(this.nature);
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getNewDataEntryList();
    // this.getVfollowupDrawer();
  }
  getNewDataEntryList() {
    this.dataEntrySub = this.dataMgmtServive
      .getNewDataEntryList(
        this.nature!,
        this.type!,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (data) => {
          this.dataEntryList = data.data.data;
          // this.totalPages = data.data.totalPages;
          this.totalItems = data.data.totalItems;
          // console.log(data.data.totalPages);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  exportToExcel() {
    const notification = this.dico?.dico_notification;
    const data = this.dataEntryList?.map((data) => {
      return {
        [notification]: data.notification,
        'Insured/Tp': data.insuredTp,
        'Owner Name': data.ownerName,
        'Policy Type': data.policyType,

        'Dispatched Date': this.datePipe.transform(
          data.dispDateTime,
          this.dateFormat('reportDateTimeFormat')
        ),
        'Accident Town': data.accidentTown,
        'Expert Name': data.expert,
        'Brand/Trademark': data.brandTradeMark,
        Plate: data.plate,
        YOM: data.yom,
        'insurance Company': data.insCompany,
        'no Days': data.noDays,
        'Reception Date': this.datePipe.transform(
          data.receptionDate,
          this.dateFormat('reportDateTimeFormat')
        ),
        'User Name': data.userName,
      };
    });

    // Call the exportToExcel method with your data
    this.sharedService.exportToExcel(
      data,
      this.getTableTitle(),
      this.getTableTitle() + '.xlsx'
    );
  }

  getTableTitle(): string {
    if (this.type === 'TPINS') {
      return 'Tp Ins. Co Follow Up';
    } else if (this.type === 'DOB') {
      return 'Date of Birth Follow Up ';
    }
    return this.nature!;
  }
}
