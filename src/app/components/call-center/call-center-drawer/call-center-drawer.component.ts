import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, interval, switchMap } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-call-center-drawer',
  templateUrl: './call-center-drawer.component.html',
  styleUrls: ['./call-center-drawer.component.css'],
})
export class CallCenterDrawerComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isDrawerOpen = true;
  showSideContainer: boolean = false;
  dico?: any;
  vfollowupDrawer: any[] = [];
  pendingDispatchCount!: number;
  pendingDispatchExpertCount!: number;
  userSelection: string = '';
  pendingDispatchData: any[] = [];
  followupData: boolean = false;
  userExpertSelection: string = '';
  pendingDispatchExpertData: any[] = [];
  temaExpertDispatchFailedList: any[] = [];
  temaExpertDelayArrivalList: any[] = [];
  temaExpertArrivedCustFollowUp: any[] = [];
  temaExpertLateCloseCaseList: any[] = [];
  company: string;
  profileId!: string;
  private intervalId: any;
  totalItems!: number;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalPages!: number;
  menuItems = [
    {
      key: 'element1',
      permission: 'ccTemaAdmin',
      icon: './assets/icons/search-dark.png',
      tooltip: 'Visa',
      altText: 'Icon for Element 1',
    },
    {
      key: 'element2',
      icon: './assets/icons/tow_follow_up.png',
      altText: 'Icon for Element 2',
      tooltip: 'Pending Towing',
      count: 0,
    },
    {
      key: 'element3',
      icon: './assets/icons/exp_follow_up.png',
      altText: 'Icon for Element 3',
      tooltip: 'Pending Expert',
      count: 0,
    },
    {
      key: 'element4',
      permission: 'ccTemaAdmin',
      icon: './assets/icons/fail_disp.png',
      altText: 'Icon for Element 4',
      tooltip: 'Failed Dispatch',
      count: 0,
    },
    {
      key: 'element5',
      permission: 'ccTemaAdmin',
      icon: './assets/icons/exp_late.png',
      altText: 'Icon for Element 5',
      tooltip: 'Expert Late',
      count: 0,
    },
    {
      key: 'element6',
      permission: 'ccTemaAdmin',
      icon: './assets/icons/cust_follow_up.png',
      altText: 'Icon for Element 6',
      tooltip: 'Customer Follow Up',
      count: 0,
    },
    {
      key: 'element7',
      permission: 'ccTemaAdmin',
      icon: './assets/icons/need_to_close.png',
      altText: 'Icon for Element 7',
      tooltip: 'Need To Close',
      count: 0,
    },
  ];

  ngOnDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    clearInterval(this.intervalId);
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getVfollowupDrawer();
  }
  onPageChangePendingTowing(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPendingDispatchBean();
  }
  onPageChangePendingExpert(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPendingDispatchExpertBean();
  }
  onPageChangeFailedDispatch(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTemaExpertDispatchFailedList();
  }
  onPageChangeExpertLate(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTemaExpertDelayArrivalList();
  }
  onPageChangeCustFollow(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTemaExpertArrivedCustFollowUp();
  }
  onPageChangeNeedToClose(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTemaExpertLateCloseCaseList();
  }
  getPendingDispatchCount() {
    this.dataService.getPendingDispatchCount(this.company!).subscribe({
      next: (data) => {
        this.pendingDispatchCount = data.data;
        this.setCount('element2', this.pendingDispatchCount); // Update count for Element 3
        if (this.pendingDispatchCount && this.pendingDispatchCount > 0) {
          this.showSideContainer = true;
          this.selectedItem = 'element2';
        }
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  setCount(key: string, count: number) {
    const menuItem = this.menuItems.find((item) => item.key === key);
    if (menuItem) {
      menuItem.count = count;
    }
  }
  // pollActionOpenDrawable() {
  //   const company = this.profileService.getCompany();
  //   this.getPendingDispatchBean();
  // }
  getPendingDispatchExpertBeanCount() {
    this.dataService
      .getPendingDispatchExpertBeanCount(this.company!)
      .subscribe({
        next: (data) => {
          this.pendingDispatchExpertCount = data.data;
          this.setCount('element3', data.data);
          if (
            this.pendingDispatchExpertCount &&
            this.pendingDispatchExpertCount > 0
          ) {
            this.selectedItem = 'element3';
            this.showSideContainer = true;
          }
          console.log(data.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  constructor(
    private dataService: DataServiceService,

    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.company = this.profileService.getCompany()!;
    this.route.params.subscribe((param) => {
      this.profileId = param['profileId'];
    });
  }
  ngOnInit() {
    this.getDico();
    this.getPendingDispatchExpertBeanCount();
    this.getPendingDispatchCount();
    this.pollData();
  }
  initializeData() {
    this.getVfollowupDrawer();
    this.getPendingDispatchCount();
    this.getPendingDispatchExpertBeanCount();
    this.getTemaExpertDispatchFailedList();
    this.getTemaExpertDelayArrivalList();
    this.getTemaExpertArrivedCustFollowUp();
    this.getTemaExpertLateCloseCaseList();
    // this.getPendingDispatchBean();
    // this.getPendingDispatchExpertBean();
  }
  pollData() {
    this.intervalId = setInterval(() => {
      this.initializeData();
    }, 900000); // 60000 milliseconds = 1 minutes
  }
  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
  selectedItem: string | null = null;

  onItemClick(item: string): void {
    if (this.selectedItem === item) {
      // If the clicked item is the currently selected one, toggle the side container
      this.showSideContainer = !this.showSideContainer;
    } else {
      // If a different item is clicked, update the selected item and open the side container
      this.selectedItem = item;
      this.showSideContainer = true;

      if (this.selectedItem === 'element1') {
        this.getVfollowupDrawer();
        this.pageSize = 10;
        this.pageNumber = 1;
      } else if (this.selectedItem === 'element4') {
        this.getTemaExpertDispatchFailedList();
        this.pageSize = 10;
        this.pageNumber = 1;
      } else if (this.selectedItem === 'element5') {
        this.getTemaExpertDelayArrivalList();
        this.pageSize = 10;
        this.pageNumber = 1;
      } else if (this.selectedItem === 'element6') {
        this.getTemaExpertArrivedCustFollowUp();
        this.pageSize = 10;
        this.pageNumber = 1;
      } else if (this.selectedItem === 'element7') {
        this.getTemaExpertLateCloseCaseList();
        this.pageSize = 10;
        this.pageNumber = 1;
      }
    }
  }
  selectedNotification(selectedNotId: string) {
    const componentRoute = `profiles-main/CallCenter/hotline/${this.profileId}/${selectedNotId}`;
    this.router.navigateByUrl(componentRoute);
    // this.router.navigate(['hotline', selectedNotId]);
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
  getTemaExpertDispatchFailedList() {
    this.dataService
      .getTemaExpertDispatchFailedList(this.pageSize, this.pageNumber)
      .subscribe({
        next: (data) => {
          this.temaExpertDispatchFailedList = data.data;
          this.pageSize = data.data.totalPages;
          this.totalItems = data.data.totalItems;
          this.setCount('element4', this.temaExpertDispatchFailedList.length);
          if (
            this.temaExpertDispatchFailedList &&
            this.temaExpertDispatchFailedList.length > 0
          ) {
            this.showSideContainer = true;
            this.selectedItem = 'element4';
          }

          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getTemaExpertDelayArrivalList() {
    this.dataService
      .getTemaExpertDelayArrivalList(this.pageSize, this.pageNumber)
      .subscribe({
        next: (data) => {
          this.temaExpertDelayArrivalList = data.data;
          this.pageSize = data.data.totalPages;
          this.totalItems = data.data.totalItems;
          this.setCount('element5', this.temaExpertDelayArrivalList.length);
          if (
            this.temaExpertDelayArrivalList &&
            this.temaExpertDelayArrivalList.length > 0
          ) {
            this.showSideContainer = true;
            this.selectedItem = 'element5';
          }
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getTemaExpertArrivedCustFollowUp() {
    this.dataService
      .getTemaExpertArrivedCustFollowUp(this.pageSize, this.pageNumber)
      .subscribe({
        next: (data) => {
          this.temaExpertArrivedCustFollowUp = data.data;
          this.pageSize = data.data.totalPages;
          this.totalItems = data.data.totalItems;
          this.setCount('element6', this.temaExpertArrivedCustFollowUp.length);
          if (
            this.temaExpertArrivedCustFollowUp &&
            this.temaExpertArrivedCustFollowUp.length > 0
          ) {
            this.selectedItem = 'element6';
            this.showSideContainer = true;
          }
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getTemaExpertLateCloseCaseList() {
    this.dataService
      .getTemaExpertLateCloseCaseList(this.pageSize, this.pageNumber)
      .subscribe({
        next: (data) => {
          this.temaExpertLateCloseCaseList = data.data;
          this.pageSize = data.data.totalPages;
          this.totalItems = data.data.totalItems;
          this.setCount('element7', this.temaExpertLateCloseCaseList.length);
          if (
            this.temaExpertLateCloseCaseList &&
            this.temaExpertLateCloseCaseList.length > 0
          ) {
            this.selectedItem = 'element7';
            this.showSideContainer = true;
          }
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getVfollowupDrawer() {
    this.dataService.vfollowupDrawer(this.pageSize, this.pageNumber).subscribe({
      next: (data) => {
        this.vfollowupDrawer = data.data;
        this.pageSize = data.data.totalPages;
        this.totalItems = data.data.totalItems;
        if (this.vfollowupDrawer && this.vfollowupDrawer.length > 0) {
          this.selectedItem = 'element1';
          this.showSideContainer = true;
        }
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getPendingDispatchBean() {
    const company = this.profileService.getCompany()!;
    this.dataService
      .getPendingDispatchBean(
        company,
        this.userSelection,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.pendingDispatchData = res.data.notResponseList.data;
          this.pendingDispatchCount = res.data.pendingDispatchCount;
          this.pageSize = res.data.notResponseList.totalPages;
          this.totalItems = res.data.notResponseList.totalItems;
          if (this.pendingDispatchCount && this.pendingDispatchCount > 0) {
            this.showSideContainer = true;
            this.selectedItem = 'element2';
          }
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getPendingDispatchExpertBean() {
    const company = this.profileService.getCompany()!;
    this.dataService
      .getPendingDispatchExpertBean(
        company,
        this.userExpertSelection,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.pendingDispatchExpertData = res.data.notResponseList;
          this.pendingDispatchExpertCount = res.data.pendingDispatchCount;
          this.pageSize = res.data.notResponseList.totalPages;
          this.totalItems = res.data.notResponseList.totalItems;

          if (
            this.pendingDispatchExpertCount &&
            this.pendingDispatchExpertCount > 0
          ) {
            this.showSideContainer = true;
            this.selectedItem = 'element3';
          }
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
