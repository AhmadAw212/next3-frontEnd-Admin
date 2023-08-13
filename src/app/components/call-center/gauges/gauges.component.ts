import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { Subscription } from 'rxjs';
import { CallCenterGauges } from 'src/app/model/call-center-gauges';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';

@Component({
  selector: 'app-gauges',
  templateUrl: './gauges.component.html',
  styleUrls: ['./gauges.component.css'],
})
export class GaugesComponent implements OnInit, OnDestroy {
  gaugesValues!: CallCenterGauges;
  expertToDispatchCount: number = 0;
  expertAllCount: number = 0;
  towingOverDue: number = 0;
  towingToDispatchCount: number = 0;
  towingAllCount: number = 0;
  noDataPolicyFound: number = 0;
  noDataAllCount: number = 0;
  expertOverDue: number = 0;
  notificationComplaintsCount: number = 0;
  dico?: any;
  expertFollowUpChartData!: GoogleChartInterface;
  towingFollowUpChartData!: GoogleChartInterface;
  expertDispatchCountGauge!: GoogleChartInterface;
  towingDispatchGauge!: GoogleChartInterface;
  noDataCountGauge!: GoogleChartInterface;
  notificationComplaintsGauge!: GoogleChartInterface;
  subscribtion?: Subscription;

  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService
  ) {}
  ngOnDestroy(): void {
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getGaugesValuesCC();
    this.getDico();
  }
  createGaugeOptions(value: number, maxValue: number): any {
    const half = maxValue / 2;
    const tickCount = 6; // Set the desired number of major ticks
    const tickStep = Math.ceil(maxValue / tickCount);
    const majorTicks = [];

    for (let i = 0; i <= maxValue; i += tickStep) {
      majorTicks.push(i.toString());
    }

    return {
      width: 400,
      height: 180,
      redFrom: half,
      redTo: maxValue,
      yellowFrom: half / 2,
      yellowTo: half,
      greenFrom: 0,
      greenTo: half / 2,
      majorTicks: majorTicks,
      minorTicks: tickStep,
      max: maxValue,
      redColor: 'rgb(255, 33, 33)', // Standard red range color
      // yellowColor: '#FFFF00', // Standard yellow range color
      greenColor: 'rgb(0, 231, 0)', // Standard green range color
    };
  }
  ExpertFollowUpGauge() {
    if (this.expertAllCount > 0) {
      this.expertFollowUpChartData = {
        chartType: 'Gauge',
        dataTable: [
          ['Label', 'Value'],
          ['', this.expertOverDue],
        ],
        options: this.createGaugeOptions(
          this.expertOverDue,
          this.expertAllCount
        ),
      };
    }
  }
  towingFollowUpGauge() {
    if (this.towingAllCount > 0) {
      this.towingFollowUpChartData = {
        chartType: 'Gauge',
        dataTable: [
          ['Label', 'Value'],
          ['', this.towingOverDue],
        ],
        options: this.createGaugeOptions(
          this.towingOverDue,
          this.towingAllCount
        ),
      };
    }
  }
  expertToDispatchGauge() {
    if (this.expertToDispatchCount > 0) {
      this.expertDispatchCountGauge = {
        chartType: 'Gauge',
        dataTable: [
          ['Label', 'Value'],
          ['', this.expertToDispatchCount],
        ],
        options: this.createGaugeOptions(
          this.expertToDispatchCount,
          this.expertToDispatchCount
        ),
      };
    }
  }

  towingToDispatchGauge() {
    if (this.towingToDispatchCount > 0) {
      this.towingDispatchGauge = {
        chartType: 'Gauge',
        dataTable: [
          ['Label', 'Value'],
          ['', this.towingToDispatchCount],
        ],
        options: this.createGaugeOptions(
          this.towingToDispatchCount,
          this.towingToDispatchCount
        ),
      };
    }
  }
  noDataAllCountGauge() {
    if (this.noDataAllCount > 0) {
      this.noDataCountGauge = {
        chartType: 'Gauge',
        dataTable: [
          ['Label', 'Value'],
          ['', this.noDataPolicyFound],
        ],
        options: this.createGaugeOptions(
          this.noDataPolicyFound,
          this.noDataAllCount
        ),
      };
    }
  }
  notificationComplaintsCountGauge() {
    if (this.notificationComplaintsCount > 0) {
      this.notificationComplaintsGauge = {
        chartType: 'Gauge',
        dataTable: [
          ['Label', 'Value'],
          ['', this.notificationComplaintsCount],
        ],
        options: this.createGaugeOptions(
          this.notificationComplaintsCount,
          this.notificationComplaintsCount
        ),
      };
    }
  }

  handleGaugesValuesResponse(gaugesValues: CallCenterGauges) {
    ({
      expertToDispatchCount: this.expertToDispatchCount,
      expertAllCount: this.expertAllCount,
      towingOverDue: this.towingOverDue,
      towingToDispatchCount: this.towingToDispatchCount,
      towingAllCount: this.towingAllCount,
      noDataPolicyFound: this.noDataPolicyFound,
      noDataAllCount: this.noDataAllCount,
      expertOverDue: this.expertOverDue,
      notificationComplaintsCount: this.notificationComplaintsCount,
    } = gaugesValues);
    this.ExpertFollowUpGauge();
    this.towingFollowUpGauge();
    this.expertToDispatchGauge();
    this.towingToDispatchGauge();
    this.noDataAllCountGauge();
    this.notificationComplaintsCountGauge();
  }

  getGaugesValuesCC(): void {
    this.subscribtion = this.dataService.getGaugesValues().subscribe({
      next: (res) => {
        this.handleGaugesValuesResponse(res.data);
      },
      error: (err) => {
        this.alertifyService.dialogAlert(err.error.message);
        console.log(err);
      },
    });
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
