import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { tap } from 'rxjs';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { CoreProfile } from 'src/app/model/core-profile';
import { type } from 'src/app/model/type';
import { UserActivity } from 'src/app/model/user-activity';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-users-activity',
  templateUrl: './users-activity.component.html',
  styleUrls: ['./users-activity.component.css'],
})
export class UsersActivityComponent implements OnInit, OnDestroy {
  title = 'User Activity';
  selectedRow!: HTMLElement;
  dico?: any;
  userActivity: UserActivity[] = [];
  searchTypes?: type[];
  fromDate: Date = new Date();
  toDate?: Date = new Date();
  user: string = '';
  type: string = '';
  selectedCompany: string = '1';
  companies: CompanyBranchList[] = [];
  users: any[] = [];
  selectedProfile?: CoreProfile;
  userCompany?: string;
  pageSize: number = 5;
  pageNumber: number = 1;
  totalPages?: number;
  currentPage: number = 1;
  // totalItems?: number;
  isUsingSearchCriteria?: boolean;
  constructor(
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService,
    private dataService: DataServiceService,
    private userRolesService: UsersRolesService,
    private datePipe: DatePipe,
    private sharedService: LoadingServiceService
  ) {
    // this.fromDate = new Date();
    // this.toDate = new Date();
  }
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.getDico().subscribe(() => {
      this.initializeSearchTypes();
    });
    this.getCompaniesPerUser();
    this.getCallCenterUsers();
    this.getCompany();
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.isUsingSearchCriteria) {
      this.getUserActivityOpenedNotifications();
    }
  }
  getCompany() {
    this.selectedProfile = this.sharedService.getSelectedProfile()!;
    this.userCompany = this.selectedProfile?.companyId;
  }
  getDico() {
    // this.dicoService.getDico();
    return this.dicoService.dico.pipe(
      tap((res) => {
        this.dico = res;
      })
    );
  }
  initializeSearchTypes() {
    const notification = this.dico?.dico_notification;

    // Replace with actual header
    this.searchTypes = [
      { code: '', description: 'ALL' },
      { code: 'NEW', description: ` New ${notification} ` },
      { code: 'EXPERT', description: 'Expert Dispatch' },
      { code: 'TOWING', description: 'Towing Dispatch' },
      { code: 'NOTE', description: 'NOTE' },
    ];
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList.map((company: any) => {
          if (company.companyId === '1') {
            company.companyName = 'ALL';
          }
          return company;
        });

        this.selectedCompany = this.companies![0]?.companyId;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }

  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.closest('tr') as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getCallCenterUsers() {
    this.dataService.getCallCenterUsers(this.selectedCompany).subscribe({
      next: (res) => {
        this.users = res.data;
        console.log(this.users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getUserActivityOpenedNotifications() {
    this.isUsingSearchCriteria = true;
    const toDateFormat = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    const formDateFormat = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    // console.log(toDateFormat);
    this.dataService
      .getUserActivityOpenedNotifications(
        this.selectedCompany,
        this.user,
        formDateFormat!,
        toDateFormat!,
        this.type
      )
      .subscribe({
        next: (res) => {
          this.userActivity = res.data;
          // this.totalPages = res.data.totalPages;
          console.log(this.totalPages);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  exportDataToExcel() {
    const notification = this.dico?.dico_notification;
    const data = this.userActivity?.map((data) => {
      return {
        Type: data.type,
        [notification]: data.notification,
        'Insured/Tp': data.insuredTp,
        'Brand/Trademark': data.brandTrademark,
        Plate: data.plate,
        YOM: data.yom,
        'Owner Name': data.ownerName,
        'VISA Date': this.datePipe.transform(
          data.notificationDate,
          this.dateFormat('reportDateTimeFormat')
        ),
        Nature: data.notificationNature,
        'Expert Name': data.expertName,
        'Accident Location': data.accidentLocation,
        'Policy Type': data.policyType,
        'Cars Count': data.carsCount,
        'Injury Count': data.injuryCount,
        'User Name': data.userName,
        Note: data.notes,
      };
    });

    // Call the exportToExcel method with your data
    this.sharedService.exportToExcel(
      data,
      'User Activity',
      'User_Activity.xlsx'
    );
  }
}
