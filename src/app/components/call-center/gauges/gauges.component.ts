import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { Subscription } from 'rxjs';
import { CallCenterGauges } from 'src/app/model/call-center-gauges';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';
import * as Gauge from 'canvas-gauges';
@Component({
  selector: 'app-gauges',
  templateUrl: './gauges.component.html',
  styleUrls: ['./gauges.component.css'],
})
export class GaugesComponent implements OnInit, OnDestroy, AfterViewInit {
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

  subscribtion?: Subscription;
  @Input() gaugeValue: number = 0;
  @ViewChild('expertToDispatch', { static: true })
  expertToDispatch!: ElementRef;
  @ViewChild('expertFollowUp', { static: true }) expertFollowUp!: ElementRef;
  @ViewChild('towingFollowUp', { static: true }) towingFollowUp!: ElementRef;
  @ViewChild('towingToDispatch', { static: true })
  towingToDispatch!: ElementRef;
  @ViewChild('noDataFollowUp', { static: true })
  noDataFollowUp!: ElementRef;
  @ViewChild('notificationComplaints', { static: true })
  notificationComplaints!: ElementRef;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService
  ) {}
  ngAfterViewInit(): void {}

  createGauge(maxValue: number, value: number, target: HTMLElement): any {
    const tickCount = 6; // Set the desired number of major ticks
    const tickStep = maxValue / (tickCount - 1); // Calculate tick step based on tick count

    const majorTicks = [];
    for (let i = 0; i < tickCount; i++) {
      majorTicks.push((i * tickStep).toFixed(1));
    }

    // majorTicks.push(maxValue.toString()); // Include the incoming max value

    return new Gauge.RadialGauge({
      renderTo: target,
      // Other gauge configuration options here
      value: value,
      maxValue: maxValue,
      majorTicks: majorTicks,
      // minorTicks: 2,
      strokeTicks: true,
      valueText: (value * 1).toLocaleString(),
      highlights: [
        {
          from: 0,
          to: maxValue * 0.3,
          color: 'rgb(0, 231, 0)', // Green for values 0 to 30% of max
        },
        {
          from: maxValue * 0.3,
          to: maxValue * 0.7,
          color: 'rgba(255, 165, 0, .75)', // Orange for values 30% to 70% of max
        },
        {
          from: maxValue * 0.7,
          to: maxValue,
          color: 'rgb(255, 33, 33)', // Red for values 70% to max
        },
      ],
      colorPlate: '#fff',
      borderShadowWidth: 1,
      borders: true,
      needleType: 'arrow',
      colorNeedleEnd: 'rgb(49, 56, 66)',
      colorNeedle: 'rgb(49, 56, 66)',
      needleWidth: 4,
      colorValueText: 'rgb(51, 51, 51)',
      // colorValueBoxShadow: 'rgb(49, 56, 66)',
      // colorValueTextShadow: 'rgb(188, 199, 210)',
      colorValueBoxBackground: 'rgb(239, 239, 241)',
      needleCircleSize: 7,
      needleCircleOuter: true,
      needleCircleInner: true,
      animationDuration: 500,
      animationRule: 'bounce',
      width: 242,
      height: 180,
    });
  }

  ngOnDestroy(): void {
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getGaugesValuesCC();
    this.getDico();
  }

  createAndDrawGauge(
    maxValue: number,
    value: number,
    target: HTMLElement
  ): void {
    const gauge = this.createGauge(maxValue, value, target);
    gauge.draw();
  }
  updateExpertFollowUpGauge(): void {
    if (this.expertToDispatchCount > 0) {
      const expertDispatchCount = this.expertToDispatch.nativeElement;
      this.createAndDrawGauge(
        this.expertToDispatchCount,
        this.expertToDispatchCount,
        expertDispatchCount
      );
    }
    if (this.expertAllCount > 0) {
      const expertAllCount = this.expertFollowUp.nativeElement;
      this.createAndDrawGauge(
        this.expertAllCount,
        this.expertOverDue,
        expertAllCount
      );
    }
    if (this.towingAllCount > 0) {
      const towingAllCount = this.towingFollowUp.nativeElement;
      this.createAndDrawGauge(
        this.towingAllCount,
        this.towingOverDue,
        towingAllCount
      );
    }
    if (this.towingToDispatchCount > 0) {
      const towingToDispatchCount = this.towingToDispatch.nativeElement;
      this.createAndDrawGauge(
        this.towingToDispatchCount,
        this.towingToDispatchCount,
        towingToDispatchCount
      );
    }
    if (this.noDataAllCount > 0) {
      const noDataAllCount = this.noDataFollowUp.nativeElement;
      this.createAndDrawGauge(
        this.noDataAllCount,
        this.noDataPolicyFound,
        noDataAllCount
      );
    }
    if (this.notificationComplaintsCount > 0) {
      const notificationComplaintsCount =
        this.notificationComplaints.nativeElement;
      this.createAndDrawGauge(
        this.notificationComplaintsCount,
        this.notificationComplaintsCount,
        notificationComplaintsCount
      );
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
    this.updateExpertFollowUpGauge();
    // this.ExpertFollowUpGauge();
    // this.towingFollowUpGauge();
    // this.expertToDispatchGauge();
    // this.towingToDispatchGauge();
    // this.noDataAllCountGauge();
    // this.notificationComplaintsCountGauge();
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
