import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Chart, ChartOptions } from 'chart.js';
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
  fromDate: any = new Date();
  toDate: any = new Date();
  user: string = '';
  type: string = '';
  selectedCompany: string = '1';
  companies: CompanyBranchList[] = [];
  users: any[] = [];
  selectedProfile?: CoreProfile;
  userCompany?: string;
  pageSize: number = 20;
  pageNumber: number = 1;
  totalPages?: number;
  // currentPage: number = 1;
  totalItems?: number;
  isUsingSearchCriteria?: boolean;
  selectedCompanyActivity?: string;
  // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 3, // Adjust this value to change the aspect ratio
  };
  pieChartLabels: any[] = []; // This will hold the userCodes
  pieChartData: number[] = []; // This will hold the activityDates
  pieChartLegend = true;
  pieChartPlugins = [];
  userData?: any;
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
    this.userRolesService.getUserRoles();
  }
  selectedCompanyAct(event: any) {
    this.selectedCompanyActivity = event;
    this.getUsersActivityByInsComp();
    console.log(this.selectedCompanyActivity);
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getUserActivityOpenedNotifications();
  }
  public chart: any;

  createChart(data: any) {
    this.pieChartLabels = this.userData.map((item: any) => item.userCode);
    this.pieChartData = this.userData.map(
      (item: any) => item.notificationsCount
    );
    console.log(this.pieChartLabels, this.pieChartData);
    this.chart = new Chart('MyChart', {
      type: 'pie',
      // type: 'doughnut',
      data: {
        labels: [this.pieChartLabels],
        datasets: [
          {
            // label: 'Area and Production of Important Crops (2020-21)',
            data: [this.pieChartData],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          title: {
            display: true,
            // text: 'Area and Production of Important Crops (2020-21)',
            font: {
              size: 24,
              weight: 'bold',
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
            padding: {
              top: 10,
              bottom: 30,
            },
          },
          legend: {
            display: true,
            labels: {
              font: {
                size: 14,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              },
            },
          },
        },
      },
    });
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
        const all = {
          c: 'ALLusers',
          d: 'ALL',
        };
        this.users.push(all);
        // console.log(this.users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getUserActivityOpenedNotifications() {
    this.isUsingSearchCriteria = true;

    // Check if toDate is undefined and set it to null
    const toDateFormat =
      this.toDate !== undefined
        ? this.datePipe.transform(this.toDate, 'yyyy-MM-dd')
        : '';
    console.log(toDateFormat);
    // Check if fromDate is undefined and set it to null
    const formDateFormat =
      this.fromDate !== undefined
        ? this.datePipe.transform(this.fromDate, 'yyyy-MM-dd')
        : '';

    this.dataService
      .getUserActivityOpenedNotifications(
        this.selectedCompany,
        this.user,
        formDateFormat!,
        toDateFormat!,
        this.type,
        this.pageNumber,
        this.pageSize
      )
      .subscribe({
        next: (res) => {
          this.userActivity = res.data.data;
          this.totalPages = res.data.totalPages;
          this.totalItems = res.data.totalItems;

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

  getUsersActivityByInsComp() {
    this.dataService
      .getUsersActivityByInsComp(this.selectedCompanyActivity!)
      .subscribe({
        next: (res) => {
          this.userData = res.data;
          this.createChart(this.userData);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
