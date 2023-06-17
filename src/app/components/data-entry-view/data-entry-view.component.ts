import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css'],
})
export class DataEntryViewComponent implements OnInit {
  navBarTitle = 'Data Entry';
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

  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getDataEntry();
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
  getDataEntry() {
    this.dataService.getDataEntry('10.9091591').subscribe({
      next: (res) => {
        this.dataEntry = res.data;
        this.lossCarList = res.data.lossCarList;
        this.bodilyInjuryList = res.data.bodilyInjuryList;
        this.materialDamageList = res.data.materialDamageList;
        console.log(res);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
