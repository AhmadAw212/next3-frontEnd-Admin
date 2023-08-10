import { Component, OnInit, SimpleChanges } from '@angular/core';
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
export class GaugesComponent implements OnInit {
  gaugesValues!: CallCenterGauges;
  expertToDispatchCount!: number;
  expertAllCount!: number;
  towingOverDue: number = 0;
  towingToDispatchCount!: number;
  towingAllCount: number = 0;
  noDataPolicyFound!: number;
  noDataAllCount!: number;
  expertOverDue: number = 0;
  notificationComplaintsCount!: number;
  dico?: any;
  ExpertFollowUpChartData!: GoogleChartInterface;
  towingFollowUpChartData!: GoogleChartInterface;
  subscribtion?: Subscription;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService
  ) {
    this.expertOverDue = this.expertService.getExpertOverDue();
    this.expertAllCount = this.expertService.getExpertAllCount();
    this.towingOverDue = this.expertService.getTowingOverDue();
    this.towingAllCount = this.expertService.getTowingAllCount();
  }
  ngOnInit(): void {
    this.towingFollowUpGauge();
    // this.ExpertFollowUpGauge();
    this.getDico();
    this.getGaugesValuesCC();
  }
  ExpertFollowUpGauge() {
    this.ExpertFollowUpChartData = {
      chartType: 'Gauge',
      dataTable: [
        ['Label', 'Value'],
        ['', this.expertOverDue],
      ],
      options: {
        width: 400,
        height: 180,
        redFrom: 70,
        redTo: 100,
        yellowFrom: 30,
        yellowTo: 70,
        greenFrom: 0,
        greenTo: 30,
        minorTicks: 10,
        majorTicks: ['0', '50', '100'],
        max: this.expertAllCount,
      },
    };
    this.updateChartOptions();
  }

  towingFollowUpGauge() {
    this.towingFollowUpChartData = {
      chartType: 'Gauge',
      dataTable: [
        ['Label', 'Value'],
        ['', this.towingOverDue],
      ],
      options: {
        width: 400,
        height: 180,
        redFrom: 70,
        redTo: 100,
        yellowFrom: 30,
        yellowTo: 70,
        greenFrom: 0,
        greenTo: 30,
        minorTicks: 10,
        majorTicks: ['0', '50', '100'],
        max: this.towingAllCount,
      },
    };
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
    this.expertService.setExpertOverDue(this.expertOverDue);
    this.expertService.setExpertAllCount(this.expertAllCount);
    this.expertService.setTowingOverDue(this.towingOverDue);
    this.expertService.setTowingAllCount(this.towingAllCount);
    this.updateChartOptions();
  }
  private updateChartOptions(): void {
    this.ExpertFollowUpChartData.options.max = this.expertAllCount;
    this.ExpertFollowUpChartData.dataTable[1][1] = this.expertOverDue;

    this.towingFollowUpChartData.options.max = this.towingAllCount;
    this.towingFollowUpChartData.dataTable[1][1] = this.towingOverDue;
    const minorTickStep = Math.floor(this.expertAllCount / 10); // Adjust the divisor as needed
    const majorTickStep = Math.floor(this.expertAllCount / 2); // Adjust the divisor as needed

    // Update the tick values in options
    this.ExpertFollowUpChartData.options.minorTicks = minorTickStep;
    this.ExpertFollowUpChartData.options.majorTicks = [
      '0',
      `${majorTickStep}`,
      `${this.expertAllCount}`,
    ];
    if (
      this.expertOverDue === this.expertAllCount ||
      this.towingOverDue === this.towingAllCount
    ) {
      // Set gauge color to red
      this.ExpertFollowUpChartData.options.redFrom = 0; // Change these values to customize the red color range
      this.ExpertFollowUpChartData.options.redTo = 100;

      this.towingFollowUpChartData.options.redFrom = 0;
      this.towingFollowUpChartData.options.redTo = 100;
    } else {
      // Set gauge color to the default values
      this.ExpertFollowUpChartData.options.redFrom = 70;
      this.ExpertFollowUpChartData.options.redTo = 100;

      this.towingFollowUpChartData.options.redFrom = 70;
      this.towingFollowUpChartData.options.redTo = 100;
    }
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
    this.ExpertFollowUpGauge();
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
