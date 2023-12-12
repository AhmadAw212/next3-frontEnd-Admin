import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DatamgmtService } from '../services/datamgmt.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-expert-follow-up-view',
  templateUrl: './expert-follow-up-view.component.html',
  styleUrls: ['./expert-follow-up-view.component.css'],
})
export class ExpertFollowUpViewComponent implements OnInit {
  dico?: any;
  company: string = '';
  companies?: any[] = [];
  expertFollowUpList: any[] = [];
  totalItems!: number;
  pageSize: number = 10;
  pageNumber: number = 1;
  private searchTimer!: any;
  supplierExperts: any[] = [];
  selectedExpert: string = '';
  fromDate!: string;
  toDate!: string;
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
    private datePipe: DatePipe,
    private dataService: DataServiceService,
    private router: Router
  ) {}

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }
  ngOnInit(): void {
    this.getDico();
    this.getCompaniesPerUser();
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
  getExpertFollowUpList() {
    const parsedToDate = moment(
      this.toDate,
      'ddd MMM DD YYYY HH:mm:ss ZZ'
    ).format('YYYY-MM-DDTHH:mm:ss');
    const parsedFromDate = moment(
      this.fromDate,
      'ddd MMM DD YYYY HH:mm:ss ZZ'
    ).format('YYYY-MM-DDTHH:mm:ss');
    this.dataMgmtServive
      .expertFollowUpList(
        this.company,
        parsedFromDate,
        parsedToDate,
        this.selectedExpert,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.expertFollowUpList = res.data.data;
          this.totalItems = res.data.totalItems;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  navigateToNotes(notificationId: string) {
    this.router.navigate([
      'profiles-main/DataManagement/notes',
      notificationId,
    ]);
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        this.companies?.push({
          companyId: 'ALL',
          companyName: 'ALL',
        });
        // console.log(this.companies);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getExpertBySupplierNamePreference(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataMgmtServive
        .getExpertBySupplierNamePreference(event.term)
        .subscribe({
          next: (res) => {
            this.supplierExperts = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }, 300);
  }

  exportToExcel() {
    const notification = this.dico?.dico_notification;
    const data = this.expertFollowUpList?.map((data) => {
      return {
        [notification]: data.notification,
        Plate: data.plate,
        Expert: data.expert,
        'Owner Name': data.ownerName,
        'Policy Type': data.policyType,

        'Expert Dispatched Date': this.datePipe.transform(
          data.dispDateTime,
          this.dateFormat('reportDateTimeFormat')
        ),
        'Accident Caza': data.accidentCaza,

        'Brand/Trademark': data.brandTradeMark,

        YOM: data.yom,
        'Reported Date': data.reportedDate,

        'Accident Date': this.datePipe.transform(
          data.accidentDate,
          this.dateFormat('reportDateTimeFormat')
        ),
        'Policy Number': data.policyNumber,
        Owner: data.owner,
      };
    });

    // Call the exportToExcel method with your data
    this.sharedService.exportToExcel(
      data,
      'Expert Follow Up',
      'Expert_Follow_Up.xlsx'
    );
  }
}
