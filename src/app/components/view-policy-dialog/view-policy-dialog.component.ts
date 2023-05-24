import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-view-policy-dialog',
  templateUrl: './view-policy-dialog.component.html',
  styleUrls: ['./view-policy-dialog.component.css'],
})
export class ViewPolicyDialogComponent implements OnInit {
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.viewPolicy();
  }

  viewPolicy() {
    this.dataService.viewPolicy('10.1.MO.347922.0.0.1').subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
