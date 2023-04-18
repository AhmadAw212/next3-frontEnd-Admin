import { Injectable } from '@angular/core';
import { DataServiceService } from './data-service.service';
import { AuthService } from './auth.service';
import { CompanyBranchList } from '../model/company-branch-list';

@Injectable({
  providedIn: 'root',
})
export class CompanyBranchService {
  companyList?: CompanyBranchList[];
  branchList: any;

  constructor(
    private dataService: DataServiceService,
    private authService: AuthService
  ) {}

  getCompanyId() {
    this.dataService.getCompanyId().subscribe({
      next: (res) => {
        this.companyList = res.data.companyList;
        // console.log(this.companyList);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
        }
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
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
        }
      },
    });
  }
}
