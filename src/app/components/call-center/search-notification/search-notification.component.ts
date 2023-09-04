import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { CallCenterSearchCars } from 'src/app/model/call-center-search-cars';
import { SearchNotification } from 'src/app/model/search-notification';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
interface NotificationType {
  code: string;
  description: string;
}
@Component({
  selector: 'app-search-notification',
  templateUrl: './search-notification.component.html',
  styleUrls: ['./search-notification.component.css'],
})
export class SearchNotificationComponent implements OnInit, OnDestroy {
  title?: string = 'Call Center Search';
  selectedValue: string = '';
  searchTypes: NotificationType[] = [];
  dico?: any;
  notification?: string;
  value: string = '';
  company?: string;
  notificationData?: SearchNotification[];
  dateFormats?: any;
  callCenterSearchCarsList?: CallCenterSearchCars[];
  selectedNotification?: SearchNotification;
  showPanelContent: boolean = false;
  notificationSubscription?: Subscription;
  companyLogo?: string;
  isHidden = false;
  showTrademark?: any;
  selectedPanelIndex: number = 0;
  isNewestAccident: boolean = false;
  lastNotification: string = '';
  isNewestTowing?: boolean = false;
  username?: string;
  constructor(
    private router: Router,
    private dicoService: DicoServiceService,
    private dataService: DataServiceService,
    private profileService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private companyLogoService: LoadingServiceService
  ) {
    const profile = this.profileService.getSelectedProfile();
    this.company = profile.companyId;
    this.username = profile.userCode;
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getDico().subscribe(() => {
      this.initializeSearchTypes();
      this.getUserLastNotification();
    });
  }
  findSearchTypeByCode(code: string): NotificationType | undefined {
    return this.searchTypes.find((searchType) => searchType.code === code);
  }
  getNotificationColor(notificationNature: string): string {
    switch (notificationNature) {
      case 'Accident':
        return 'red';
      case 'Accident+Towing':
        return 'blue';
      case 'Towing':
        return 'green';
      case 'Existing Damages':
        return 'purple';
      default:
        return 'black';
    }
  }

  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  togglePanelContent(notification: SearchNotification, index: number) {
    this.showPanelContent = true;
    this.selectedNotification = notification;
    this.selectedPanelIndex = index;
  }
  // navigateToDetails(notification: SearchNotification) {

  // }
  getDico() {
    // this.dicoService.getDico();
    return this.dicoService.dico.pipe(
      tap((res) => {
        this.dico = res;
      })
    );
  }
  goBack(): void {
    this.router.navigate(['/profiles-main/CallCenter']);
  }
  initializeSearchTypes() {
    const notification = this.dico?.dico_notification;

    // Replace with actual header
    this.searchTypes = [
      { code: 'PLATE', description: 'Plate Number' },
      { code: 'NOTIFICATION', description: `${notification} Number` },
      { code: 'CLAIMNUM', description: 'Claim Number' },
      { code: 'POLICY', description: 'Policy Number' },
      { code: 'PHONE', description: 'Phone Number' },
      { code: 'NAME', description: 'Name' },
      { code: 'NTOW', description: 'Newest Towing' },
      { code: 'NACCIDENT', description: 'Newest Accident' },
      { code: 'SIM_PLATE', description: 'Similar Plate' },
    ];
    this.selectedValue = this.searchTypes[1].code;
  }

  NewestAccident() {
    this.isNewestAccident = true;
    if (this.isNewestAccident === true) {
      this.selectedValue = 'NACCIDENT';
      this.value = this.username!;
      this.searchNotification();
    }
  }
  NewestTowing() {
    this.isNewestTowing = true;
    if (this.isNewestTowing === true) {
      this.selectedValue = 'NTOW';
      this.value = this.username!;
      this.searchNotification();
    }
  }
  getUserLastNotification() {
    this.dataService.getUserLastNotification().subscribe({
      next: (res) => {
        this.lastNotification = res.data;
        if (this.lastNotification) {
          this.value = this.lastNotification;
        }
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  searchNotification() {
    this.isNewestAccident = false;
    this.isNewestTowing = false;
    this.notificationSubscription = this.dataService
      .getNotificationSearch(this.selectedValue!, this.company!, this.value!)
      .subscribe({
        next: (res) => {
          this.notificationData = res.data.callCenterSearchMainBeanList.map(
            (data: SearchNotification) => ({
              ...data,
              companyLogo: `data:image/jpeg;base64,${data.companyLogo}`,
            })
          );

          this.showTrademark = res.data.showCarTrademark;

          if (this.notificationData!.length > 0) {
            this.togglePanelContent(
              this.notificationData![0],
              this.selectedPanelIndex
            );
          } else {
            this.showPanelContent = false;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
