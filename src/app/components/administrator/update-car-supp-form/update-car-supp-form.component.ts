import { Component, Input, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-update-car-supp-form',
  templateUrl: './update-car-supp-form.component.html',
  styleUrls: ['./update-car-supp-form.component.css'],
})
export class UpdateCarSuppFormComponent implements OnInit {
  suppGrade?: any;
  GradeId?: string;
  @Input() supplierType?: type[];
  selectedSuppType?: string;
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.getSupplierGrade();
  }
  getSupplierGrade() {
    this.dataService.getSupplierGrade().subscribe({
      next: (res) => {
        this.suppGrade = res.data;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
