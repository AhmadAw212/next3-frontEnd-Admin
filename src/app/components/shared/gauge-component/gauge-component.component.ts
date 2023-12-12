import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as Gauge from 'canvas-gauges';
@Component({
  selector: 'app-gauge-component',
  templateUrl: './gauge-component.component.html',
  styleUrls: ['./gauge-component.component.css'],
})
export class GaugeComponentComponent {
  @ViewChild('gaugeCanvas', { static: true }) gaugeCanvas!: ElementRef;

  @Input() maxValue!: number;
  @Input() value!: number;
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    this.createAndDrawGauge();
  }
  // ngAfterViewInit(): void {
  //   if (this.target && this.target.nativeElement) {
  //     this.createAndDrawGauge();
  //   }
  // }
  private createAndDrawGauge(): void {
    // console.log(this.maxValue, this.value);
    const gauge = this.createGauge(
      this.maxValue,
      this.value,
      this.gaugeCanvas.nativeElement
    );
    gauge.draw();
  }
  createGauge(maxValue: number, value: number, target: HTMLElement): any {
    const tickCount = 7; // Set the desired number of major ticks
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
      fontValueWeight: 'bold',
      fontValueSize: 35,
      // colorValueBoxShadow: 'rgb(49, 56, 66)',
      // colorValueTextShadow: 'rgb(188, 199, 210)',
      colorValueBoxBackground: 'white',
      needleCircleSize: 7,
      needleCircleOuter: true,
      needleCircleInner: true,
      animationDuration: 500,
      animationRule: 'bounce',
      width: 242,
      height: 180,
    });
  }

  // createGauge(): any {
  //   const tickCount = 7; // Set the desired number of major ticks
  //   const tickStep = this.maxValue / (tickCount - 1); // Calculate tick step based on tick count

  //   const majorTicks = [];
  //   for (let i = 0; i < tickCount; i++) {
  //     majorTicks.push((i * tickStep).toFixed(1));
  //   }

  //   // majorTicks.push(maxValue.toString()); // Include the incoming max value

  //   return new Gauge.RadialGauge({
  //     renderTo: this.target!.nativeElement,
  //     // Other gauge configuration options here
  //     value: this.value,
  //     maxValue: this.maxValue,
  //     majorTicks: majorTicks,
  //     // minorTicks: 2,
  //     strokeTicks: true,
  //     valueText: (this.value * 1).toLocaleString(),
  //     highlights: [
  //       {
  //         from: 0,
  //         to: this.maxValue * 0.3,
  //         color: 'rgb(0, 231, 0)', // Green for values 0 to 30% of max
  //       },
  //       {
  //         from: this.maxValue * 0.3,
  //         to: this.maxValue * 0.7,
  //         color: 'rgba(255, 165, 0, .75)', // Orange for values 30% to 70% of max
  //       },
  //       {
  //         from: this.maxValue * 0.7,
  //         to: this.maxValue,
  //         color: 'rgb(255, 33, 33)', // Red for values 70% to max
  //       },
  //     ],
  //     colorPlate: '#fff',
  //     borderShadowWidth: 1,
  //     borders: true,
  //     needleType: 'arrow',
  //     colorNeedleEnd: 'rgb(49, 56, 66)',
  //     colorNeedle: 'rgb(49, 56, 66)',
  //     needleWidth: 4,
  //     colorValueText: 'rgb(51, 51, 51)',
  //     fontValueWeight: 'bold',
  //     fontValueSize: 35,
  //     // colorValueBoxShadow: 'rgb(49, 56, 66)',
  //     // colorValueTextShadow: 'rgb(188, 199, 210)',
  //     colorValueBoxBackground: 'white',
  //     needleCircleSize: 7,
  //     needleCircleOuter: true,
  //     needleCircleInner: true,
  //     animationDuration: 500,
  //     animationRule: 'bounce',
  //     width: 242,
  //     height: 180,
  //   });
  // }
}
