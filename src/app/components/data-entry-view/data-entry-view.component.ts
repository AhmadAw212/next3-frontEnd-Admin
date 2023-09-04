import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css'],
})
export class DataEntryViewComponent implements OnInit {
  navBarTitle = 'Data Entry View';
  isLoading: boolean = false;
  showDataEntryDetails = false;
  showBodilyInjury: boolean = false;
  showMatDamage: boolean = false;
  dataEntry?: any;
  lossCarList?: any[];
  insuredDetails: any;
  thirdPartyDetails: any;
  bodilyInjuryList?: any[];
  materialDamageList?: any[];
  selectedRow!: HTMLElement;
  selectedInjuredSequence!: any;
  selectedLossCar?: any;
  selectedMatDamage?: any;
  dico?: any;
  notificationId: string = '';
  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private route: ActivatedRoute,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.getDico();
    this.route.params.subscribe((params) => {
      const notificationId = params['notificationId'];
      this.getDataEntry(notificationId);
      // console.log(notificationId);
      // Now you have access to the notificationId parameter, and you can use it in your component logic.
    });
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
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
  toggleDataEntryDetails(lossCar: any) {
    this.selectedLossCar = lossCar;
    this.showDataEntryDetails = true;
    this.showBodilyInjury = false;
    this.showMatDamage = false;
  }

  toggleBodilyInjury(injured: any) {
    this.selectedInjuredSequence = injured;
    this.showDataEntryDetails = false;
    this.showBodilyInjury = true;
    this.showMatDamage = false;
  }

  toggleMaterialDamage(matDamage: any) {
    this.selectedMatDamage = matDamage;
    this.showDataEntryDetails = false;
    this.showBodilyInjury = false;
    this.showMatDamage = true;
  }

  //10.9091591
  getDataEntry(notification: string) {
    this.dataService.getDataEntry(notification).subscribe({
      next: (res) => {
        this.dataEntry = res.data;
        this.lossCarList = res.data.lossCarList;
        this.bodilyInjuryList = res.data.bodilyInjuryList;
        this.materialDamageList = res.data.materialDamageList;
        // console.log(res);
        if (this.lossCarList && this.lossCarList.length > 0) {
          this.toggleDataEntryDetails(this.lossCarList[0]);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
