import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallCenterSearchCars } from 'src/app/model/call-center-search-cars';
import { SearchNotification } from 'src/app/model/search-notification';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.css'],
})
export class NotificationDetailsComponent implements OnInit {
  @Input() selectedNotification?: SearchNotification;
  @Input() showTrademark?: any;
  dico?: any;
  constructor(
    private dataService: DataServiceService,

    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.userRolesService.getUserRoles();
    // console.log(this.selectedNotification);
  }
  shouldShowCarInfo(car: CallCenterSearchCars): boolean {
    const notificationMatDamage =
      this.selectedNotification?.notificationMatDamage;

    return (
      (car.sequence === 0 && notificationMatDamage === '5') ||
      notificationMatDamage === '6' ||
      notificationMatDamage === '10'
    );
  }
  // navigateToDataEntry(notificationId: string) {
  //   const componentRoute = `dataEntryView/${notificationId}`;
  //   this.router.navigateByUrl(componentRoute);
  // }
  navigateToMail(carId: string) {
    const componentRoute = `sendEmail/${carId}`;
    this.router.navigateByUrl(componentRoute);
  }
  // navigateToHotline(notificationId: string) {
  //   const componentRoute = `hotline/${notificationId}`;

  //   this.router.navigateByUrl(componentRoute);
  // }

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
}
