import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css'],
})
export class DataEntryViewComponent implements OnInit {
  navBarTitle = 'DataEntry';
  isLoading: boolean = false;
  dataEntry?: any;
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.getDataEntry();
  }

  getDataEntry() {
    this.dataService.getDataEntry('10.424032008').subscribe({
      next: (res) => {
        this.dataEntry = res.data;
        console.log(res);
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
