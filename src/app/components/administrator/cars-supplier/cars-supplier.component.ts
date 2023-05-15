import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-cars-supplier',
  templateUrl: './cars-supplier.component.html',
  styleUrls: ['./cars-supplier.component.css'],
})
export class CarsSupplierComponent implements OnInit {
  showMoreInfo?: boolean = false;
  suppType?: type[];
  selectedType?: string;
  constructor(private dataService: DataServiceService) {}

  showProfList() {
    this.showMoreInfo = true;
  }

  ngOnInit(): void {
    this.getSupplierTyple();
  }

  getSupplierTyple() {
    this.dataService.getSupplierType().subscribe({
      next: (res) => {
        this.suppType = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
