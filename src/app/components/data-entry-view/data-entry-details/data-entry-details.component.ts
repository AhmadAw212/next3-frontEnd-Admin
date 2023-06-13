import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-entry-details',
  templateUrl: './data-entry-details.component.html',
  styleUrls: ['./data-entry-details.component.css'],
})
export class DataEntryDetailsComponent implements OnInit {
  @Input() lossCarList: any;

  ngOnInit(): void {}

  constructor() {}
}
