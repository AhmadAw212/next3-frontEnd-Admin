import { Injectable } from '@angular/core';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyBranchService {
  companyList: any;
  branchList: any;

  constructor(private dataService: DataServiceService) {}

  getCompanyId() {
    this.dataService.getCompanyId().subscribe({
      next: (res) => {
        this.companyList = res.data.companyList;
        console.log(this.companyList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getBranchId(companyId: string) {
    this.dataService.getBranchId(companyId).subscribe({
      next: (res) => {
        this.branchList = res.data.map((branch: any) => branch);

        // filter the branch list based on the selected company ID
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
