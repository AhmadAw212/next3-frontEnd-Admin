import { Component, OnInit } from '@angular/core';
import { CallCenterGauges } from 'src/app/model/call-center-gauges';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-gauges',
  templateUrl: './gauges.component.html',
  styleUrls: ['./gauges.component.css'],
})
export class GaugesComponent implements OnInit {
  gaugesValues!: CallCenterGauges;
  expertToDispatchCount!: number;
  expertAllCount!: number;
  towingOverDue!: number;
  towingToDispatchCount!: number;
  towingAllCount!: number;
  noDataPolicyFound!: number;
  noDataAllCount!: number;
  expertOverDue!: number;
  notificationComplaintsCount!: number;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.getGaugesValuesCC();
  }
  gaugeValue = 4;
  gaugeLabel = 'Speed';
  gaugeAppendText = 'km/hr';
  thresholdConfig = [
    { value: 0, color: 'green' },
    { value: 3, color: 'orange' },
    { value: 9, color: 'red' },
  ];
  markerConfig = {
    '0': { color: '#555', size: 3, label: '0', type: 'line' },
    '10': { color: '#555', size: 3, label: '1', type: 'line' },
    '20': { color: '#555', size: 3, label: '2', type: 'line' },
    '30': { color: '#555', size: 3, label: '3', type: 'line' },
    '40': { color: '#555', size: 3, label: '4', type: 'line' },
    '50': { color: '#555', size: 3, label: '5', type: 'line' },
    '60': { color: '#555', size: 3, label: '6', type: 'line' },
    '70': { color: '#555', size: 3, label: '7', type: 'line' },
    '80': { color: '#555', size: 3, label: '8', type: 'line' },
    '90': { color: '#555', size: 3, label: '9', type: 'line' },
    '100': { color: '#555', size: 3, label: '10', type: 'line' },
  };

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
  }

  getGaugesValuesCC(): void {
    this.dataService.getGaugesValues().subscribe({
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
